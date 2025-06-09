import os
import pickle

import cv2

import numpy as np
import pandas as pd

from skimage.transform import resize
from skimage.io import imread
from skbio.diversity.alpha import shannon

from keras.models import load_model
from joblib import load
import tensorflow as tf

import matplotlib.pyplot as plt
from django.conf import settings


DATA_DIR = os.path.join(settings.BASE_DIR, "data")
TEMP_DIR = os.path.join(settings.BASE_DIR, 'media', 'temp_dir')

# model
model_path = os.path.join(DATA_DIR, "20231025_045454_unetAtten_size300_acc99_IoU98.h5")
model = load_model(model_path)

# reference percentile
with open(os.path.join(DATA_DIR, "ref_percentile_dict.pickle"), 'rb') as f:
    ref_percentile_dict = pickle.load(f)

GBM_clf = load(os.path.join(DATA_DIR, "GBM_classifier_231120.joblib"))


def calculate_fineness(jpg_files):
    # img_file_path 내 모든 jpg 이미지들을 가져와 순회하며 섬세지수 계산
    results = []

    for jpg_file in jpg_files:
        results.append(calculate_fineness_by_image(TEMP_DIR, jpg_file))

    return results


def calculate_fineness_by_image(img_dir_path, img_path):
   # Load image
    img = imread(img_path)

    # Resize image
    resized_img = resize(img, (300, 300), mode='constant', preserve_range=True).astype(np.uint8)

    # Predict mask using the provided model
    pred_mask = (model.predict(resized_img[np.newaxis, :], verbose=0)[0][:, :, :] > 0.5).astype(np.uint8)

    # Process mask to refine contours
    processed_mask = process_mask(pred_mask)

    # Remove contour line to focus on ribeye area
    img_only_ribeye, mask = remove_contour_line(img, processed_mask, THICKNESS=40)

    # Extract ribeye area based on the refined mask
    img_only_ribeye2 = extract_ribeye(img_only_ribeye, mask)

    # Extract fat particles from the ribeye area
    fat_img = extract_fat_article(img_only_ribeye2)

    # Create dataframe to store contours of fat particles
    fat_df = create_contour_df(fat_img)

    # 면적 0보다 큰 값만 추출
    fat_df['contour_area'] = list(map(cv2.contourArea, fat_df['contour']))
    fat_df = fat_df[fat_df['contour_area']>0]

    
    # 등심 면적, 지방 면적, 지방면적비 계산
    all_contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    ribeye_area = np.sum(processed_mask>=1)
    fat_area = np.sum(fat_img>=1)

    fat_ribeye_ratio = fat_area / ribeye_area * 100

    
    # 큰 지방입자를 제외한 등심 면적 계산
    fat_df['log_contour_area'] = np.log(fat_df['contour_area'] + 1)
    large_fat_area_sum = fat_df.loc[fat_df['log_contour_area'] > 8, 'contour_area'].sum()
    ribeye_area_adjusted = ribeye_area - large_fat_area_sum
    
    # 지방입자 그림 1: 지방입자 크기 5-8 표시한 그림
    img_w_fat = img.copy()
    contours = fat_df.loc[(5<fat_df['log_contour_area']) & (fat_df['log_contour_area']<=8), 'contour']

    for contour in contours:
        cv2.fillPoly(img_w_fat, [contour], (0,255,0))

    # 지방입자 그림 2: 가장 큰 입자 5개 표시한 그림
    img_w_big5 = img.copy()
    contours = fat_df.sort_values(by='contour_area', ascending=False)['contour'].values[:5]

    colors = [(0, 255, 0), (0, 255, 255), (0, 0, 255),(255, 0, 0), (255, 255, 0)]

    for contour, color in zip(contours, colors):
        cv2.drawContours(img_w_big5, [contour], 0, color, 5)

    # 섬세도 계산 및 저장
    fineness_dict = {}
    unit_area_size_cm = 17  # Unit area size in cm
    img_resolution = 2400  # Image resolution in pixels
    unit_area_cm2 = (unit_area_size_cm ** 2)
    
    # F11: 지방입자 5-8 구간 개수
    fineness_dict['log_contour_area_5_8_count'] = cal_count_by_section(fat_df['log_contour_area'], 5, 8)

    # F16: 단위면적당 지방입자 5-8 구간 개수
    unit_count = ((img_resolution ** 2) * 9 / unit_area_cm2) * fineness_dict['log_contour_area_5_8_count'] / ribeye_area
    fineness_dict['unit_count'] = unit_count

    # F17: 수정된 단위면적당 지방입자 5-8 구간 개수
    unit_count_fat_removed = ((img_resolution ** 2) * 9 / unit_area_cm2) * fineness_dict['log_contour_area_5_8_count'] / ribeye_area_adjusted
    fineness_dict['unit_count_fat_removed'] = unit_count_fat_removed
    
    # 값 저장
    fineness_dict['file_name'] = os.path.basename(img_path)
    fineness_dict['img'] = img
    fineness_dict['processed_mask'] = processed_mask
    fineness_dict['img_w_fat'] = img_w_fat
    fineness_dict['img_w_big5'] = img_w_big5
    fineness_dict['fat_img'] = fat_img
    fineness_dict['fat_ribeye_ratio'] = fat_ribeye_ratio

    meat_grade, meat_value = assign_grade_for_fat_ribeye_ratio(fineness_dict['fat_ribeye_ratio'])
    fineness_dict['F11_assign'] = assign_grade_for_F11(fineness_dict['log_contour_area_5_8_count'], meat_grade)
    fineness_dict['F16_assign'] = assign_grade_for_F16(fineness_dict['unit_count'], meat_grade)
    fineness_dict['F17_assign'] = assign_grade_for_F17(fineness_dict['unit_count_fat_removed'], meat_grade)

    media_relative_path = os.path.relpath(img_path, settings.MEDIA_ROOT)
    original_file_url = os.path.join(settings.MEDIA_URL, media_relative_path)
    original_file = os.path.splitext(os.path.basename(img_path))[0]

    processed_mask_file = save_processed_image(img_dir_path, original_file, 'processed_mask', fineness_dict['processed_mask'])
    img_w_fat_file = save_processed_image(img_dir_path, original_file, 'img_w_fat', fineness_dict['img_w_fat'])

    cv2.imwrite(processed_mask_file, fineness_dict['processed_mask'])
    cv2.imwrite(img_w_fat_file, fineness_dict['img_w_fat'])

    f11 = f"{fineness_dict['log_contour_area_5_8_count']:.1f} ({fineness_dict['F11_assign']})"
    f16 = f"{fineness_dict['unit_count']:.1f} ({fineness_dict['F16_assign']})"
    f17 = f"{fineness_dict['unit_count_fat_removed']:.1f} ({fineness_dict['F17_assign']})"

    return [original_file, original_file_url, processed_mask_file, img_w_fat_file, meat_grade, meat_value, f11, f16, f17]


def process_mask(mask):

    # resize
    new_mask_resized = resize(mask, (2400, 2400), mode='constant', preserve_range=True)

    # (1) extract contours in predicted mask
    contours, _ = cv2.findContours(new_mask_resized.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    # (2) get the largest contour
    if len(contours)>1:
        max_len = np.max([len(contour) for contour in contours])
        contour = [contour for contour in contours if len(contour)==max_len][0]
    elif len(contours)==1:
        contour = contours[0]
    else:
        raise
    
    # 축소된 컨투어 내부 채우기
    shrinked_pts = contour - (contour - np.mean(contour, axis=0)) * 0.002 # 축소시키기
    cv2.fillPoly(new_mask_resized, [shrinked_pts.astype(int)], 255)

    # 컨투어 외부 채우기
    new_mask = np.zeros(new_mask_resized.shape)
    cv2.fillPoly(new_mask, [contour], 255)
    
    new_mask_resized[new_mask != 255] = 0
    
    return new_mask_resized


def extract_ribeye(img, mask):
    '''
    등심 영역만 추출 (배경을 모두 0 값으로 변경)
    '''
    
    # copy image
    img_only_ribeye = img.copy()
    
    # replace from background_value to 0
    img_only_ribeye[:,:,0][mask[:,:,0]==False] = 0
    img_only_ribeye[:,:,1][mask[:,:,0]==False] = 0
    img_only_ribeye[:,:,2][mask[:,:,0]==False] = 0
    
    return(img_only_ribeye)


def remove_contour_line(img, mask, THICKNESS=40):
    '''
    등심 컨투어 부분 일부 제거
    (일부 이미지에서 지방 라인이 존재해서 제거함, 지방라인은 지방 추출에 방해가 됨)
    '''
    
    # copy image
    img_copied = img.copy()
    mask_copied = mask.copy()
    
    # extract ribeye contours
    contours, _ = cv2.findContours(mask_copied.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    
    # find the largest contour
    if len(contours)>1:
        max_len = np.max([len(contour) for contour in contours])
        contour = [contour for contour in contours if len(contour)==max_len][0]
    elif len(contours)==1:
        contour = contours[0]
    else:
        raise
    
    # remove contour_line
    img_copied2 = cv2.drawContours(img_copied, [contour], -1, (0,0,0), THICKNESS)
    mask_copied2 = cv2.drawContours(mask_copied.astype('uint8'), contours, -1, (0,0,0), THICKNESS)
    
    return img_copied2, mask_copied2


def extract_fat_article(img, ADD_THRESHOLD=0):
    '''
    이미지에서 지방 입자만 추출
    '''
    
    # copy image
    img_copied = img.copy()
    
    # flatten
    temp = img_copied.ravel()
    
    # 0, 255 제외한 나머지값 추출
    temp2 = temp[np.all([temp < 255, temp > 0], axis=0)]
    
    # otsu 메서드 적용
    ret, _ = cv2.threshold(temp2, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    ret = ret+ADD_THRESHOLD
    
    # binarization
    fat_img = np.all(img_copied > [ret, ret, ret], axis=-1)
    
    return fat_img.astype(np.uint8)


def create_contour_df(fat_img):
    
    # get contour
    fat_contours, _ = cv2.findContours(fat_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # dataframe
    df = pd.DataFrame({'contour':fat_contours})
    
    return df


def cal_count_by_section(values, start, end):
    count = np.sum((start<values) & (values<=end))
    return count


def assign_grade_for_fat_ribeye_ratio(value):
    '''
    input: 지방면적비
    output: 육질등급 1++(9), 1++(8), 1++(7), 1+, 1, 2, 3
    '''
    grades = [
        (100, 'Value exceeds the maximum threshold'),
        (35.9, '1++(9)'),
        (32.9, '1++(8)'),
        (30.9, '1++(7)'),
        (25.9, '1+'),
        (20.9, '1'),
        (14.9, '2'),
        (0.01, '3'),
        (0, 'Value is below the acceptable range')
    ]
    
    if value <= 0:
        raise ValueError(f'Value {value} is invalid')
    
    for threshold, grade in grades:
        if value >= threshold:
            if 'Value' in grade:
                raise ValueError(f'Value {value} {grade}')
            return grade, round(value, 2)


def assign_grade_for_F11(value, meat_qual_grade):
    grade_boundaries = {
        '1++(9)': (178.1, 212.2),
        '1++(8)': (182.4, 213.6),
        '1++(7)': (187.1, 218.8),
        '1+': (180.1, 212.6),
        '1': (166.1, 196.9),
        '2': (144.8, 176.7),
        '3': (92.4, 125.8)
    }
    
    if meat_qual_grade not in grade_boundaries:
        raise ValueError(f'육질등급 {meat_qual_grade} is invalid')

    lower_bound, upper_bound = grade_boundaries[meat_qual_grade]

    if value <= lower_bound:
        return '뭉침'
    elif value <= upper_bound:
        return '보통'
    elif value > upper_bound:
        return '섬세'
    else:
        raise ValueError(f'Value {value} is invalid')


def assign_grade_for_F16(value, meat_qual_grade):
    grade_boundaries = {
        '1++(9)': (19.2, 22.7),
        '1++(8)': (20.7, 24.1),
        '1++(7)': (21.5, 24.8),
        '1+': (21.2, 24.4),
        '1': (20.3, 23.6),
        '2': (18.3, 21.4),
        '3': (14.3, 17.9)
    }
    
    if meat_qual_grade not in grade_boundaries:
        raise ValueError(f'육질등급 {meat_qual_grade} is invalid')

    lower_bound, upper_bound = grade_boundaries[meat_qual_grade]

    if value <= lower_bound:
        return '뭉침'
    elif value <= upper_bound:
        return '보통'
    elif value > upper_bound:
        return '섬세'
    else:
        raise ValueError(f'Value {value} is invalid')


def assign_grade_for_F17(value, meat_qual_grade):
    grade_boundaries = {
        '1++(9)': (25.52, 29.62),
        '1++(8)': (26.24, 29.62),
        '1++(7)': (26.68, 30.23),
        '1+': (25.34, 28.75),
        '1': (23.73, 27.18),
        '2': (20.29, 23.45),
        '3': (14.64, 18.28)
    }
    
    if meat_qual_grade not in grade_boundaries:
        raise ValueError(f'육질등급 {meat_qual_grade} is invalid')

    lower_bound, upper_bound = grade_boundaries[meat_qual_grade]

    if value <= lower_bound:
        return '뭉침'
    elif value < upper_bound:
        return '보통'
    elif value >= upper_bound:
        return '섬세'
    else:
        raise ValueError(f'Value {value} is invalid')


def save_processed_image(img_dir, original_file, img_type, image):
    # 이미지 데이터 타입을 np.uint8로 변환
    image = image.astype(np.uint8)

    # 파일 이름 및 전체 경로 설정
    file_name = f'{original_file}_{img_type}.jpg'
    full_path = os.path.join(img_dir, file_name)

    # 단일 채널(흑백) 이미지의 경우 RGB 변환 X
    if image.ndim == 2 or image.shape[2] == 1:
        cv2.imwrite(full_path, image)
    else:
        # 이미지가 다중 채널인 경우 (BGR 이미지를 RGB로 변환)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        cv2.imwrite(full_path, rgb_image)

    # 템플릿 서빙을 위한 상대참조 URL 생성
    media_relative_path = os.path.relpath(full_path, settings.MEDIA_ROOT)
    img_url = os.path.join(settings.MEDIA_URL, media_relative_path)

    return img_url
