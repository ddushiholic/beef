from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth, messages
from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db.models import Min
from ..models import User, Cow, Evaluation
from .predict_views import calculate_fineness

import zipfile
import shutil
import os


# Create your views here.
def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        password_check = request.POST.get('passwordCheck')
        name = request.POST.get('name')
        email = request.POST.get('email')
        organization = request.POST.get('organization')
        field = request.POST.get('radio')

        # 입력값에 대한 타당성 체크
        if not username or not password or not password_check or not email or not organization or field is None:
            messages.error(request, "모든 필드를 입력해주세요.")
            return redirect('signup')

        if password != password_check:
            messages.error(request, "비밀번호가 일치하지 않습니다.")
            return redirect('signup')

        try:
            validate_email(email)
        except ValidationError:
            messages.error(request, "유효한 이메일 주소를 입력해주세요.")
            return redirect('signup')

        # 입력받은 field에 해당하는 Group을 매핑.
        try:
            group = Group.objects.get(name=field)
        except Group.DoesNotExist:
            messages.error(request, "선택한 그룹을 찾을 수 없습니다.")
            return redirect('signup')

        # 입력값이 올바를 경우 사용자 생성
        try:
            user = User.objects.create_user(username=username, password=password, name=name, email=email, organization=organization)
            user.groups.add(group)
            user.save()
        except BaseException:
            messages.error(request, "회원가입 중 오류가 발생했습니다.")
            return redirect('signup')

        return redirect('index')

    # 기본 페이지 로딩을 위함
    return render(request, 'ui-1112.html')


def login(request):
    context = {
        'login_failed': False,
        'is_granted_failed': False
    }

    if request.method == 'POST':
        form = AuthenticationForm(request=request, data=request.POST)

        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')

            user = auth.authenticate(
                request=request,
                username=username,
                password=password
            )

            if user is not None:
                if user.is_granted:
                    auth.login(request, user)
                    return redirect('evaluate_random')
                else:
                    # 로그인 성공, is_granted가 False인 경우
                    context['is_granted_failed'] = True
        else:
            context['login_failed'] = True

    return render(request, 'ui-1111.html', context)


def logout(request):
    auth.logout(request)
    return redirect('index')


# 조건에 만족하는 한우 데이터를 랜덤하게 선택하여 redirect
# 모든 한우 데이터들 중 평가횟수가 가장 적은 소들 중 이미 내 평가가 존재하는 한우 정보 제외
# 사용자가 작성한 기존 평가가 존재할 경우 update 하기 위해 action 변수 활용
@login_required(login_url='accounts/login')
def evaluate_random(request):
    # 최소 평가 횟수를 구한 뒤 해당 횟수의 한우 정보들만 필터링
    min_evaluate_count = Cow.objects.aggregate(min_value=Min('evaluate_count'))['min_value']
    min_evaluate_cows = Cow.objects.filter(evaluate_count=min_evaluate_count)

    # 이미 사용자가 평가한 항목들을 제외한 뒤 랜덤으로 선택
    evaluation_cow_ids = Evaluation.objects.filter(user=request.user).values_list('cow')
    random_cows = min_evaluate_cows.exclude(identifier__in=evaluation_cow_ids)

    # 최소 평가 항목들 중 특정 사용자가 평가하지 않은 항목이 없을 경우,
    # 전체 한우 데이터 중 사용자가 평가한 항목만 제외하여 반환
    if not random_cows.exists():
        cows = Cow.objects.all()
        random_cows = cows.exclude(identifier__in=evaluation_cow_ids)

    random_cow = random_cows.order_by('?').first()
    return redirect('evaluate_detail', cow_data=random_cow.identifier, action='post')


def evaluate_detail(request, cow_data, action):
    if request.method == 'GET':
        user_data = request.user
        user_group = user_data.groups.first()
        cow_data = Cow.objects.get(identifier=cow_data)
        max_count = settings.MAX_EVALUATE_COUNT_PER_GROUP.get(user_group.name)
        evaluations = Evaluation.objects.filter(user=user_data).order_by('evaluated_at')

        context = {
            'user_data': user_data,
            'cow_data': cow_data,
            'max_count': max_count,
            'evaluations': evaluations,
            'action': action
        }

        return render(request, 'ui-1113.html', context)

    elif request.method == 'POST':
        # action이 POST일 경우 신규 평가 생성
        if action == 'post':
            user = request.user
            fineness = request.POST.get('customRadio')
            cow = Cow.objects.filter(identifier=cow_data).first()

            if not fineness:
                messages.error(request, "평가값이 입력되지 않았습니다")
                return redirect('evaluate_random')

            evaluation = Evaluation.objects.create(
                user=user,
                cow=cow,
                fineness=fineness
            )
            evaluation.save()

            user.evaluate_count = user.evaluate_count + 1
            user.save()

            cow.evaluate_count = cow.evaluate_count + 1
            cow.save()

            return redirect('evaluate_random')

        # action이 update일 경우 기존 평가 업데이트
        elif action == 'update':
            new_fineness = request.POST.get('customRadio')
            cow_data = request.POST.get('cow_id')

            evaluation = Evaluation.objects.get(user=request.user, cow=cow_data)
            evaluation.fineness = new_fineness
            evaluation.save()

            return redirect('evaluate_random')


def fineness_index(request):
    user_data = request.user

    context = {
        'user_data': user_data,
        'results': None
    }

    return render(request, 'ui-2111.html', context)


def get_fineness(request):
    files = request.FILES
    results = []

    temp_dir = os.path.join(settings.BASE_DIR, 'media', 'temp_dir')
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)

    # 작업 수행 전 잔여 파일 삭제
    for file_name in os.listdir(temp_dir):
        file_path = os.path.join(temp_dir, file_name)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f"Error deleting file/directory: {e}")

    # 입력받은 파일들을 임시 디렉토리에 저장
    for uploaded_file in files.values():
        file_path = os.path.join(temp_dir, uploaded_file.name)

        with open(os.path.join(temp_dir, uploaded_file.name), 'wb+') as destination_file:
            for chunk in uploaded_file.chunks():
                destination_file.write(chunk)

            # .zip 파일의 경우 압축을 해제하여 임시 디렉토리에 저장한 뒤 파일들을 순회하여 계산
            if uploaded_file.name.endswith('.zip'):
                with zipfile.ZipFile(os.path.join(temp_dir, uploaded_file.name), 'r') as zip_ref:
                    zip_ref.extractall(temp_dir)

                # jpg_file들을 저장하기 위한 리스트
                jpg_files = []

                # temp_dir 내부에 저장된 모든 파일들을 순회하여 .jpg일 경우 리스트에 추가하여 섬세지수 계산 함수 호출
                for root, dirs, files in os.walk(temp_dir):
                    if '__MACOSX' in root:
                        continue

                    for file in files:
                        if file.lower().endswith('.jpg'):
                            jpg_files.append(os.path.join(root, file))

                # 이미지 파일이 20개 이상일 경우 에러 메시지 출력
                if len(jpg_files) > 20:
                    return HttpResponse(status=400)

                results = calculate_fineness(jpg_files)
            else:
                # zip 파일이 아닌 경우 바로 결과 계산
                results = calculate_fineness([file_path])

    return JsonResponse({
        'results': results
    })
