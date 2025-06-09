from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.core.files import File
from finebeefWeb.models import Cow

import pandas as pd
import os


class Command(BaseCommand):
    help = '엑셀 파일로부터 데이터를 읽어오기 위한 명령어입니다'

    def add_arguments(self, parser):
        parser.add_argument('excel_directory', type=str, help='엑셀 파일 경로')
        parser.add_argument('image_directory', type=str, help='이미지 파일이 위치한 디렉토리 경로')

    def handle(self, *args, **options):
        excel_directory = options['excel_directory']
        image_directory = options['image_directory']

        try:
            df = pd.read_excel(excel_directory)
            df.fillna(0, inplace=True)

            for index, row in df.iterrows():
                workplace_code_for_path = str(row[1]).zfill(4)
                slaughtered_at_for_path = str(row[4]).replace('-', '')[:8]
                slaughter_number_for_path = str(row[7]).zfill(4)

                identifier = os.path.join(f"{workplace_code_for_path}_{slaughtered_at_for_path}_{slaughter_number_for_path}")
                image_file_path = os.path.join(image_directory, f"{identifier}.jpg")

                if os.path.exists(image_file_path):
                    with open(image_file_path, 'rb') as img_file:
                        Cow.objects.create(
                            identifier=identifier,
                            workplace_code=str(row[1]).zfill(4),
                            decided_at=row[2],
                            referenced_at=row[3],
                            slaughtered_at=row[4],
                            purpose=row[5],
                            input_number=row[6],
                            slaughter_number=row[7],
                            cultivars=row[8],
                            gender=row[9],
                            backfat_thickness=row[10],
                            sirloin_cross_section=row[11],
                            conductor_weight=row[12],
                            meat_quantity_index=row[13],
                            meat_quantity_grade=row[14],
                            intramuscular_fat_number=row[15],
                            intramuscular_fat_grade=row[16],
                            meat_color_number=row[17],
                            meat_color_grade=row[18],
                            fat_color_number=row[19],
                            fat_color_grade=row[20],
                            tissue_sense_number=row[21],
                            tissue_sense_grade=row[22],
                            maturity=row[23],
                            meat_quality_grade=row[24],
                            meat_amount_up_and_down=row[25],
                            extra_code=row[26],
                            extra_number=row[27],
                            defectiveness=row[28],
                            final_grade=row[29],
                            evaluator_number=str(row[30]).zfill(5),
                            defectiveness_code=row[31],
                            defectiveness_explan=row[32],
                            auctioned_at=row[33],
                            auctioning_price=row[34],
                            history_number=str(row[35]).zfill(12),
                            applicant_number=str(row[36]).zfill(10),
                            applicant_name=row[37],
                            farmhouse_regist_number=str(row[38]).zfill(8),
                            farmhouse_name=row[39],
                            farmhouse_number=row[40],
                            imported_beef_country_code=row[41],
                            register_id=row[42],
                            registered_at=row[43],
                            register_time=row[44],
                            modifier_id=row[45],
                            modified_at=row[46],
                            modify_time=row[47],
                            perforated_area=row[48],
                            foreleg=row[49],
                            topside=row[50],
                            brand_code=row[51],
                            image_file=File(img_file, name=f"{identifier}.jpg"),
                            evaluate_count=0
                        )
                    self.stdout.write(self.style.SUCCESS(f'Data from {excel_directory} imported successfully'))
                else:
                    self.stderr.write(self.style.ERROR(f'Image file {image_file_path} not found'))
        except Exception as e:
            print(f"Error occurred for identifier: {identifier}")
