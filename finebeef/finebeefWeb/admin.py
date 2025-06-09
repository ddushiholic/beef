from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Cow, Evaluation
from django.contrib.auth.models import Group
from django.db.models import Case, When, F, Value, FloatField, Count, Sum, IntegerField, Avg
from django.db.models.functions import Cast
from django.utils.safestring import mark_safe
from django.conf import settings


# Register your models here.
@admin.register(User)
class UserAdmin(UserAdmin):
    list_display = ('id', 'name', 'get_group', 'organization', 'is_granted',
                    'evaluate_count', 'progress_ratio_sort', 'veryfine_ratio_sort',
                    'fine_ratio_sort', 'normal_ratio_sort', 'lump_ratio_sort', 
                    'verylump_ratio_sort', 'wrong_image_ratio_sort')
    list_display_links = ('id', 'name', )
    list_filter = ('groups', 'is_granted')
    search_fields = ('name', 'is_granted', 'organization', 'username')
    ordering = ('date_joined', )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        return queryset.annotate(
            max_evaluation_count=Case(
                When(groups__name='analyst', then=Value(settings.MAX_EVALUATE_COUNT_PER_GROUP.get('analyst'))),
                When(groups__name='consumer', then=Value(settings.MAX_EVALUATE_COUNT_PER_GROUP.get('consumer'))),
                When(groups__name='distributor', then=Value(settings.MAX_EVALUATE_COUNT_PER_GROUP.get('distributor'))),
                When(groups__name='evaulator', then=Value(settings.MAX_EVALUATE_COUNT_PER_GROUP.get('evaulator'))),
                default=None,
                output_field=FloatField(),
            )
        ).annotate(
            progress_ratio=Cast((Cast(F('evaluate_count'), FloatField()) / Cast(F('max_evaluation_count'), FloatField())) * 100, FloatField()),
            veryfine_ratio=Cast((Count(Case(When(evaluations__fineness=1, then=1))) / Cast(F('max_evaluation_count'), FloatField())) * 100, FloatField()),
            fine_ratio=Cast((Count(Case(When(evaluations__fineness=2, then=1))) / Cast(F('max_evaluation_count'), FloatField())) * 100, FloatField()),
            normal_ratio=Cast((Count(Case(When(evaluations__fineness=3, then=1))) / Cast(F('max_evaluation_count'), FloatField())) * 100, FloatField()),
            lump_ratio=Cast((Count(Case(When(evaluations__fineness=4, then=1))) / Cast(F('max_evaluation_count'), FloatField())) * 100, FloatField()),
            verylump_ratio=Cast((Count(Case(When(evaluations__fineness=5, then=1))) / Cast(F('max_evaluation_count'), FloatField())) * 100, FloatField()),
            wrong_image_ratio=Cast((Count(Case(When(evaluations__fineness=9, then=1))) / Cast(F('max_evaluation_count'), FloatField())) * 100, FloatField())
        )
    
    def get_group(self, obj):
        return obj.groups.first().name
    
    def progress_ratio_sort(self, obj):
        return round(obj.progress_ratio, 2)
    
    def veryfine_ratio_sort(self, obj):
        return round(obj.veryfine_ratio, 2)
    
    def fine_ratio_sort(self, obj):
        return round(obj.fine_ratio, 2)
    
    def normal_ratio_sort(self, obj):
        return round(obj.normal_ratio, 2)
    
    def lump_ratio_sort(self, obj):
        return round(obj.lump_ratio, 2)
    
    def verylump_ratio_sort(self, obj):
        return round(obj.verylump_ratio, 2)
    
    def wrong_image_ratio_sort(self, obj):
        return round(obj.wrong_image_ratio, 2)

    progress_ratio_sort.admin_order_field = 'progress_ratio'
    veryfine_ratio_sort.admin_order_field = 'veryfine_ratio'
    fine_ratio_sort.admin_order_field = 'fine_ratio'
    normal_ratio_sort.admin_order_field = 'normal_ratio'
    lump_ratio_sort.admin_order_field = 'lump_ratio'
    verylump_ratio_sort.admin_order_field = 'verylump_ratio'
    wrong_image_ratio_sort.admin_order_field = 'wrong_image_ratio'

    progress_ratio_sort.short_description = '진척도 (%)'
    veryfine_ratio_sort.short_description = '매우섬세 비율 (%)'
    fine_ratio_sort.short_description = '매우 비율 (%)'
    normal_ratio_sort.short_description = '보통 비율 (%)'
    lump_ratio_sort.short_description = '매우섬세 비율 (%)'
    verylump_ratio_sort.short_description = '매우섬세 비율 (%)'
    wrong_image_ratio_sort.short_description = '판정불가 비율 (%)'


@admin.register(Cow)
class CowAdmin(admin.ModelAdmin):
    list_display = (
        'identifier', 'final_grade', 'auctioning_price', 'evaluate_count',
        'analyst_count_sort', 'evaluator_count_sort', 'consumer_count_sort', 'distributor_count_sort', 
        'analyst_average_sort', 'evaluator_average_sort', 'consumer_average_sort', 'distributor_average_sort',
        'analyst_fineness', 'evaluator_fineness', 'consumer_fineness', 'distributor_fineness',
    )
    list_filter = ('final_grade', )
    search_fields = ('identifier', 'latest_modified_at')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        return queryset.annotate(
            analyst_count=Sum(
                Case(
                    When(evaluations__user__groups__name='analyst', then=1),
                    default=Value(0),
                    output_field=IntegerField()
                )
            ),
            evaluator_count=Sum(
                Case(
                    When(evaluations__user__groups__name='evaulator', then=1),
                    default=Value(0),
                    output_field=IntegerField()
                )
            ),
            consumer_count=Sum(
                Case(
                    When(evaluations__user__groups__name='consumer', then=1),
                    default=Value(0),
                    output_field=IntegerField()
                )
            ),
            distributor_count=Sum(
                Case(
                    When(evaluations__user__groups__name='distributor', then=1),
                    default=Value(0),
                    output_field=IntegerField()
                )
            ),
            analyst_average=Avg(
                Case(
                    When(
                        evaluations__user__groups__name='analyst',
                        evaluations__fineness__lt=9,
                        then=F('evaluations__fineness')
                    ),
                    default=Value(0),
                    output_field=FloatField()
                )
            ),
            evaluator_average=Avg(
                Case(
                    When(
                        evaluations__user__groups__name='evaulator',
                        evaluations__fineness__lt=9,
                        then=F('evaluations__fineness')
                    ),
                    default=Value(0),
                    output_field=FloatField()
                )
            ),
            consumer_average=Avg(
                Case(
                    When(
                        evaluations__user__groups__name='consumer',
                        evaluations__fineness__lt=9,
                        then=F('evaluations__fineness')
                    ),
                    default=Value(0),
                    output_field=FloatField()
                )
            ),
            distributor_average=Avg(
                Case(
                    When(
                        evaluations__user__groups__name='distributor',
                        evaluations__fineness__lt=9,
                        then=F('evaluations__fineness')
                    ),
                    default=Value(0),
                    output_field=FloatField()
                )
            ),
        )
    
    def analyst_fineness(self, obj):
        evaluations = Evaluation.objects.filter(user__groups__name='analyst', cow=obj)
        return "".join([str(evaluation.fineness) for evaluation in evaluations])
    
    def evaluator_fineness(self, obj):
        evaluations = Evaluation.objects.filter(user__groups__name='evaulator', cow=obj)
        return "".join([str(evaluation.fineness) for evaluation in evaluations])
    
    def consumer_fineness(self, obj):
        evaluations = Evaluation.objects.filter(user__groups__name='consumer', cow=obj)
        return "".join([str(evaluation.fineness) for evaluation in evaluations])
    
    def distributor_fineness(self, obj):
        evaluations = Evaluation.objects.filter(user__groups__name='distributor', cow=obj)
        return "".join([str(evaluation.fineness) for evaluation in evaluations])

    def analyst_count_sort(self, obj):
        return obj.analyst_count
    
    def evaluator_count_sort(self, obj):
        return obj.evaluator_count
    
    def consumer_count_sort(self, obj):
        return obj.consumer_count
    
    def distributor_count_sort(self, obj):
        return obj.distributor_count
    
    def analyst_average_sort(self, obj):
        return round(obj.analyst_average, 2)
    
    def evaluator_average_sort(self, obj):
        return round(obj.evaluator_average, 2)
    
    def consumer_average_sort(self, obj):
        return round(obj.consumer_average, 2)
    
    def distributor_average_sort(self, obj):
        return round(obj.distributor_average, 2)
    
    def analyst_fineness_sort(self, obj):
        return obj.analyst_fineness
    
    def evaluator_fineness_sort(self, obj):
        return obj.evaluator_fineness
    
    def consumer_fineness_sort(self, obj):
        return obj.consumer_fineness
    
    def distributor_fineness_sort(self, obj):
        return obj.distributor_fineness
    
    analyst_count_sort.admin_order_field = 'analyst_count'
    evaluator_count_sort.admin_order_field = 'evaluator_count'
    consumer_count_sort.admin_order_field = 'consumer_count'
    distributor_count_sort.admin_order_field = 'distributor_count'
    analyst_average_sort.admin_order_field = 'analyst_average'
    evaluator_average_sort.admin_order_field = 'evaluator_average'
    consumer_average_sort.admin_order_field = 'consumer_average'
    distributor_average_sort.admin_order_field = 'distributor_average'

    analyst_count_sort.short_description = '분석가 평가 횟수'
    evaluator_count_sort.short_description = '평가사 평가 횟수'
    consumer_count_sort.short_description = '소비자 평가 횟수'
    distributor_count_sort.short_description = '유통종사자 평가 횟수'
    analyst_average_sort.short_description = '분석가 평균'
    evaluator_average_sort.short_description = '평가사 평균'
    consumer_average_sort.short_description = '소비자 평균'
    distributor_average_sort.short_description = '유통종사자 평균'
    analyst_fineness.short_description = '분석가 평가'
    evaluator_fineness.short_description = '평가사 평가'
    consumer_fineness.short_description = '소비자 평가'
    distributor_fineness.short_description = '유통종사자 평가'

    def image_tag(self, obj):
        if obj.image_file:
            return mark_safe('<img src="{}" style="max-width: 300px; max-height: 300px;" />'.format(obj.image_file.url))
        return None

    readonly_fields = ('image_tag',)


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('get_user_name', 'get_user_group', 'cow',
                    'fineness', 'evaluated_at', 'modified_at')
    list_filter = ('user__groups', 'user__name')

    def get_user_name(self, obj):
        return obj.user.name

    get_user_name.short_description = '사용자 이름'

    def get_user_group(self, obj):
        return obj.user.groups.first()

    get_user_group.short_description = '그룹'


class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user_count',
                    'total_evaluation_count', 'average_progress')
    list_filter = ('name',)

    def user_count(self, obj):
        return obj.user_set.count()

    user_count.short_description = '전체 사용자 수'

    def total_evaluation_count(self, obj):
        users = obj.user_set.all()
        total_evaluation_count = 0

        for user in users:
            try:
                total_evaluation_count += user.evaluate_count  # 사용자의 평가 횟수
            except user.DoesNotExist:
                pass

        return total_evaluation_count

    total_evaluation_count.short_description = '전체 평가 횟수'

    def average_progress(self, obj):
        # 그룹에 속한 사용자 목록 조회
        users = obj.user_set.all()
        total_progress = 0

        # 각 그룹에 속한 사용자의 진척률을 합산
        for user in users:
            try:
                total_progress += user.evaluate_count
            except User.DoesNotExist:
                pass

        # 사용자들의 전체 진행률 합산을 백분율로 환산
        if users.count() > 0:
            average_progress = total_progress / users.count()
            average_progress_percentage = average_progress / \
                settings.MAX_EVALUATE_COUNT_PER_GROUP.get(obj.name) * 100
            return str(round(average_progress_percentage, 2))
        else:
            return None

    average_progress.short_description = '평균 진척률 (%)'


admin.site.unregister(Group)
admin.site.register(Group, GroupAdmin)
