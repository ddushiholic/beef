FROM python:3.10.4

ENV PYTHONUNBUFFERED=1

# 작업 디렉토리 설정
WORKDIR /app

# Python 및 Node 의존성 설치
COPY bin/requirements.txt /app/
RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    libgl1-mesa-glx \
    curl \
    git && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/mesa/

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# 소스 코드 전체 복사
COPY . /app/


# 프론트엔드 빌드
WORKDIR /app/finebeef/fed-starter
RUN npm install && npm run build

# static 파일 수집 (Django)
WORKDIR /app/finebeef
RUN python manage.py collectstatic --noinput

# 최종 작업 디렉토리
WORKDIR /app/finebeef

# 기본 커맨드
CMD ["gunicorn", "finebeef.wsgi:application", "--bind", "0.0.0.0:8000"]

