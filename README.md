# 📝 Todo Widget App

위젯으로 사용 가능한 할 일 관리 앱

## ✨ 주요 기능

- ✅ **할 일 추가/수정/삭제**
- 🔄 **완료 상태 토글**
- 🎯 **필터링** (전체/진행중/완료)
- 📊 **실시간 통계** (전체/진행중/완료 개수)
- 💾 **로컬 스토리지** 자동 저장
- 📱 **PWA 지원** - 홈 화면에 추가 가능
- 🎨 **반응형 디자인**
- ⚡ **오프라인 작동**

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 모드 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 자동 오픈

### 프로덕션 빌드

```bash
npm run build
```

`build` 폴더에 최적화된 프로덕션 빌드 생성

## 📱 위젯으로 사용하기

### 모바일 (iOS/Android)

1. 웹 브라우저에서 사이트 접속
2. **Safari (iOS)**: 공유 버튼 → "홈 화면에 추가"
3. **Chrome (Android)**: 메뉴 → "홈 화면에 추가"
4. 위젯처럼 사용 가능!

### 데스크톱 (Chrome/Edge)

1. 주소창 오른쪽의 설치 아이콘 클릭
2. "설치" 클릭
3. 독립 앱으로 실행 가능

## 🎯 사용법

### 기본 사용

1. **할 일 추가**: 입력창에 텍스트 입력 후 "추가" 버튼 또는 Enter
2. **완료 체크**: 체크박스 클릭
3. **수정**: 할 일 텍스트 더블클릭 또는 ✏️ 버튼
4. **삭제**: 🗑️ 버튼 클릭

### 필터링

- **전체**: 모든 할 일 표시
- **진행중**: 완료되지 않은 할 일만
- **완료**: 완료된 할 일만

### 통계

- 상단에 실시간 통계 표시
  - 전체 할 일 개수
  - 진행중인 할 일 개수
  - 완료된 할 일 개수

### 일괄 삭제

- 완료된 항목이 있으면 하단에 "완료된 항목 삭제" 버튼 표시
- 클릭하면 완료된 모든 항목 일괄 삭제

## 💾 데이터 저장

- 모든 데이터는 **브라우저 로컬 스토리지**에 자동 저장
- 브라우저를 닫아도 데이터 유지
- 별도의 서버나 계정 필요 없음

## 🎨 커스터마이징

### 색상 변경

`src/App.css`에서 그라데이션 색상 수정:

```css
/* 메인 그라데이션 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 원하는 색상으로 변경 */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### 스타일 수정

- `src/App.css`: 메인 스타일
- `src/index.css`: 글로벌 스타일

## 🛠️ 기술 스택

- **React 18**: UI 라이브러리
- **Local Storage**: 데이터 저장
- **PWA**: 앱처럼 설치 가능
- **CSS3**: 스타일링
- **Service Worker**: 오프라인 지원

## 📦 배포

### Vercel (추천)

```bash
npm i -g vercel
vercel
```

### Netlify

1. `npm run build` 실행
2. `build` 폴더를 Netlify에 드래그 앤 드롭

### GitHub Pages

```bash
npm install gh-pages --save-dev
```

`package.json`에 추가:
```json
"homepage": "https://yourusername.github.io/todo-widget-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

배포:
```bash
npm run deploy
```

## 🌟 특징

### 위젯 최적화

- 작은 화면에 최적화된 UI
- 빠른 로딩 속도
- 최소한의 데이터 사용

### 접근성

- 키보드 네비게이션 지원
- 반응형 디자인
- 모바일 친화적

### 성능

- 가벼운 용량
- 빠른 응답 속도
- 오프라인 작동

## 📝 라이선스

MIT License

---

**Made with ❤️ using React**
