from django.conf import settings
from django.core.management.base import BaseCommand
from finebeefWeb.models import Cow, User, Evaluation
from django.db.models import F

import pandas as pd
import os


class Command(BaseCommand):
    help = '모델에 존재하는 데이터를 추출하기 위한 명령어입니다'

    def handle(self, *args, **options):
        models = [User, Cow, Evaluation]
        output_folder = os.path.join(settings.BASE_DIR, 'output_data')

        # 추출한 데이터들을 저장하기 위한 임시 디렉토리
        os.makedirs(output_folder, exist_ok=True)

        # 각 모델을 순회하여 데이터프레임을 추출
        for model in models:
            datas = model.objects.all().values()
            if model is Evaluation:
                datas = (model.objects.annotate(
                            user_name=F('user__name'),
                            user_group=F('user__groups__name')
                                            ).values())

            df = pd.DataFrame.from_records(datas)

            model_name = model.__name__
            output_file = os.path.join(output_folder, f'{model_name}.csv')
            df.to_csv(output_file, index=False, encoding='cp949')

            self.stdout.write(self.style.SUCCESS(f'데이터가 {output_file}에 성공적으로 내보내졌습니다.'))
