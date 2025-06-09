# FED Dev environment

## Prerequisites

- Node.js 14.15.0 LTS
- NPM 6

```
- 파일 다운로드
https://nodejs.org/dist/v14.19.0/
(MaxOS) node-v14.15.0.pkg 다운로드
(WinOS) node-v14.15.0-x64.msi 다운로드

- NVM 으로 NodeJS 설치 시
(MacOS) https://github.com/nvm-sh/nvm 참고
(WinOS) https://github.com/coreybutler/nvm-windows 참고

- NVM Helps
$ `nvm ls-remote`  # 사용 가능한 Node Version List
$ `nvm install <viesion>` # 특정 버젼의 Node 설치
$ `nvm install --lts` # 또는 LTS Version 으로 설치
$ `nvm use <version>` # 사용할 Node 버전 설정
$ `nvm install <version> --reinstall-packages-from-<version>` # Update Node Version
```

## Folder structure

- src: 프론트엔드 소스
- src/js: ES5 Custom fed 소스
- src/mjs: ES6+ 소스 (ES Modules)
- src/cjs: 웹 접근성, 그리드 검사 소스 (ES Modules)
- src/iconfonts : 아이콘폰트 변환전 svg 원본 소스

## Usage

### Install dependencies

```
cd fed-starter
npm install
```

### Compiles and minifies for production

```
npm run build
```

### Server & Compiles and hot-reloads for development

```
npm run dev
```

### Accessibility for development

```
npm run check
```

## Features include

- Live reload in development
- ES6+ transpilation (by Babel)
- Sass compilation (autoprefixing)
- ES Modules (by Webpack)
- CSS, JS, Minification in production
- Convert svg file to iconfont
- Accessibility and Grid check
