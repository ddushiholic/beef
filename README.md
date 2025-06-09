# finebeef 🐄

`finebeef`는 Django 기반의 서비스로, Docker 및 docker-compose를 통해 실행됩니다.  
초기 데이터 및 이미지 업로드 기능이 포함되어 있으며, 관리자는 웹 UI를 통해 접근 가능합니다.

---

## 🐳 사전 준비: Docker 및 Docker Compose 설치

### macOS (Homebrew 사용 시)
```bash
brew install --cask docker
```

설치 후 Docker Desktop 실행 필수

### Ubuntu
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER
```

---

## 📦 설치 및 실행

### 1. 프로젝트 압축 해제
```bash
unzip finebeef-main.zip
cd finebeef-main/bin
```

### 2. Docker 이미지 빌드
```bash
docker-compose build
```

### 3. 컨테이너 실행
```bash
docker-compose up -d
```

---

## ⚙️ Django 초기 세팅

```bash
docker-compose exec -it finebeef_django bash
```

### 4. 프론트엔드 빌드
```bash
cd fed-starter
npm run build
cd ..
```

### 5. 정적 파일 수집
```bash
python manage.py collectstatic --noinput
```

### 6. 마이그레이션 적용
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. 초기 데이터 로딩
```bash
python manage.py loaddata finebeefWeb/fixtures/initial_data.json
```

---

## 🖼️ 이미지 및 평가 데이터 로딩

```bash
python manage.py load_media_data '엑셀 파일 절대경로' '이미지 디렉토리 절대경로'
```

예:
```bash
python manage.py load_media_data /Users/yourname/판정결과.xlsx /Users/yourname
```

> 엑셀 경로는 **파일명까지 포함**해야 합니다.

---

## 🌐 웹 접속

브라우저에서 접속:

```
http://127.0.0.1:8400
```

### 🔐 관리자 계정

- ID: `admin`  
- PW: `insilicogen`

---

## 📝 기타

- `STATICFILES_DIRS` 및 `MEDIA_ROOT` 설정은 `settings.py` 참고
- 커스텀 유저 모델을 사용하므로, 마이그레이션 순서 반드시 유지 필요

---

© insilicogen, Inc.

