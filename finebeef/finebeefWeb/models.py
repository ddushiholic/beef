from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    name = models.CharField(null=True, blank=True, max_length=20)
    is_active = models.BooleanField(default=True)   # 괸리자 승인 후 이용 가능
    is_granted = models.BooleanField(default=False) # 해당 필드를 통해 활성화 여부 구분
    organization = models.CharField(max_length=50, default="", verbose_name='기관 정보')
    evaluate_count = models.IntegerField(default=0, verbose_name="평가 횟수")

    class Meta:
        verbose_name = '사용자'
        verbose_name_plural = '사용자'

    def __str__(self):
        return str(self.id)


class Cow(models.Model):
    identifier = models.CharField(primary_key=True, max_length=50, verbose_name='소 ID')
    workplace_code = models.CharField(max_length=10, verbose_name='작업장 코드')
    decided_at = models.CharField(max_length=30, verbose_name='판정 일자')
    referenced_at = models.CharField(max_length=30, verbose_name='기준 일자')
    slaughtered_at = models.CharField(max_length=30, verbose_name='도축 일자')
    purpose = models.IntegerField(verbose_name='용도')
    input_number = models.IntegerField(verbose_name='입력 번호')
    slaughter_number = models.IntegerField(verbose_name='도축 번호')
    cultivars = models.IntegerField(verbose_name='품종')
    gender = models.IntegerField(verbose_name='성별')
    backfat_thickness = models.IntegerField(verbose_name='등지방 두께')
    sirloin_cross_section = models.IntegerField(verbose_name='등심 단면적')
    conductor_weight = models.IntegerField(verbose_name='도체 중량')
    meat_quantity_index = models.FloatField(verbose_name='육량 지수')
    meat_quantity_grade = models.CharField(max_length=10, verbose_name='육량 등급')
    intramuscular_fat_number = models.IntegerField(verbose_name='근내지방 번호')
    intramuscular_fat_grade = models.CharField(max_length=10, verbose_name='근내지방 등급')
    meat_color_number = models.IntegerField(verbose_name='육색 번호')
    meat_color_grade = models.CharField(max_length=10, verbose_name='육색 등급')
    fat_color_number = models.IntegerField(verbose_name='지방색 번호')
    fat_color_grade = models.CharField(max_length=10, verbose_name='지방색 등급')
    tissue_sense_number = models.IntegerField(verbose_name='조각감 번호')
    tissue_sense_grade = models.CharField(max_length=10, verbose_name='조각감 등급')
    maturity = models.IntegerField(verbose_name='성숙도')
    meat_quality_grade = models.CharField(max_length=10, verbose_name='육질 등급')
    meat_amount_up_and_down = models.CharField(max_length=10, blank=True, null=True, verbose_name='육량 상하향')
    extra_code = models.CharField(max_length=10, blank=True, null=True, verbose_name='등외 코드')
    extra_number = models.IntegerField(blank=True, null=True, verbose_name='등외 번호')
    defectiveness = models.CharField(max_length=10, blank=True, null=True, verbose_name='결함')
    final_grade = models.CharField(max_length=10, verbose_name='최종 등급')
    evaluator_number = models.IntegerField(verbose_name='평가사 번호')
    defectiveness_code = models.IntegerField(blank=True, null=True, verbose_name='결함 세부코드')
    defectiveness_explan = models.CharField(max_length=100, blank=True, null=True, verbose_name='결함 설명')
    auctioned_at = models.CharField(max_length=30, verbose_name='경매 일자')
    auctioning_price = models.IntegerField(verbose_name='경락 가격')
    history_number = models.CharField(max_length=30, verbose_name='이력번호')
    applicant_number = models.CharField(max_length=30, verbose_name='신청자 등록번호')
    applicant_name = models.CharField(max_length=100, verbose_name='신청자 상호')
    farmhouse_regist_number = models.CharField(max_length=30, verbose_name='출하농가 등록번호')
    farmhouse_name = models.CharField(max_length=100, verbose_name='출하농가 이름')
    farmhouse_number = models.CharField(max_length=30, verbose_name='농장 번호')
    imported_beef_country_code = models.IntegerField(blank=True, null=True, verbose_name='수입우 국가코드')
    register_id = models.IntegerField(blank=True, null=True, verbose_name='등록자 ID')
    registered_at = models.CharField(max_length=50, verbose_name='등록 일자')
    register_time = models.CharField(max_length=50, verbose_name='등록 시각')
    modifier_id = models.IntegerField(blank=True, null=True, verbose_name='수정자 ID')
    modified_at = models.CharField(max_length=50, verbose_name='수정 일자')
    modify_time = models.CharField(max_length=50, verbose_name='수정 시각')
    perforated_area = models.CharField(max_length=50, verbose_name='절취 부위')
    foreleg = models.CharField(max_length=50, blank=True, null=True, verbose_name='앞다리')
    topside = models.CharField(max_length=50, blank=True, null=True, verbose_name='우둔')
    brand_code = models.IntegerField(verbose_name='브랜드 코드')
    image_file = models.ImageField(upload_to='images/', verbose_name='이미지')
    evaluate_count = models.IntegerField(verbose_name="평가 횟수")

    class Meta:
        verbose_name = '한우'
        verbose_name_plural = '한우'

    def __str__(self):
        return str(self.identifier)


class Evaluation(models.Model):
    evaluation_id = models.BigAutoField(primary_key=True, verbose_name='평가 ID')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='사용자 ID', related_name='evaluations')
    cow = models.ForeignKey(Cow, on_delete=models.CASCADE, verbose_name='소 ID', related_name='evaluations')
    fineness = models.IntegerField(verbose_name='섬세 판정 결과')
    evaluated_at = models.DateTimeField(auto_now_add=True, verbose_name='평가일')
    modified_at = models.DateTimeField(auto_now=True, verbose_name='수정일')

    class Meta:
        verbose_name = '평가'
        verbose_name_plural = '평가'

    def __str__(self):
        return str(self.evaluation_id)
