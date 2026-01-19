# 📝 Noto - Todo Widget App

노션 스타일의 할 일 관리 앱

## ✨ 주요 기능

### 📋 할 일 관리
- ✅ **할 일 추가/수정/삭제**
- 🔄 **완료 상태 토글**
- ✏️ **인라인 수정** - 수정 버튼으로 팝업에서 편집
- 🗑️ **삭제 확인** - 삭제 시 확인 알림
- 🎯 **드래그 앤 드롭** - 미완료 항목 순서 변경 가능
- 📌 **완료 항목 자동 정렬** - 완료된 항목은 자동으로 하단 배치

### 📅 날짜별 관리
- **Daily** - 일별 할 일 관리 및 날짜 네비게이션
- **Weekly** - 주별 할 일 관리 (일요일~토요일)
- **Monthly** - 월별 할 일 관리
- 📆 날짜 선택 및 이전/다음 날짜로 이동

### 🏷️ 태그 시스템
- **태그 추가** - 할 일에 태그 지정
- **태그 자동완성** - 기존 태그 제안
- **태그별 그룹화** - 태그별로 항목 자동 정리
- **태그 색상 관리** - 노션 스타일의 10가지 색상 선택
  - Default, Gray, Brown, Orange, Yellow
  - Green, Blue, Purple, Pink, Red
- **색상 표시** - 태그명 하단에 색상 바 표시

### 🔍 검색 기능
- **키워드 검색** - 할 일 내용 및 태그 검색
- **태그 필터** - 특정 태그로 필터링
- **복합 검색** - 태그 + 키워드 조합 검색
- **검색 결과 표시** - 태그 색상과 함께 결과 표시

### ⚙️ 설정 메뉴
- **배경 설정** - 노트, 메모장, 격자무늬 타입 선택
- **태그 관리** - 태그별 색상 변경 및 개수 확인
- **사이드 메뉴** - 우측에서 슬라이드 인 방식

### 💾 데이터 관리
- **로컬 스토리지** 자동 저장
- **태그 색상** 저장 및 복원
- 브라우저를 닫아도 데이터 유지

### 🎨 UI/UX
- **Bottom Sheet** - 모바일 친화적 팝업
- **반응형 디자인** - 모바일/데스크톱 최적화
- **부드러운 애니메이션** - 슬라이드, 페이드 효과
- **커스텀 컴포넌트** - Select, TagInput, Checkbox

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

### Stylelint 실행

```bash
npm run lint:css        # CSS 린트 체크
npm run lint:css:fix    # CSS 린트 자동 수정
```

## 📱 PWA로 사용하기

### 모바일 (iOS/Android)

1. 웹 브라우저에서 사이트 접속
2. **Safari (iOS)**: 공유 버튼 → "홈 화면에 추가"
3. **Chrome (Android)**: 메뉴 → "홈 화면에 추가"
4. 앱처럼 사용 가능!

### 데스크톱 (Chrome/Edge)

1. 주소창 오른쪽의 설치 아이콘 클릭
2. "설치" 클릭
3. 독립 앱으로 실행 가능

## 🎯 사용법

### 할 일 추가

1. 하단 네비게이션의 **+** 버튼 클릭
2. 날짜, 태그, 할 일 내용 입력
3. "추가" 버튼 클릭

### 할 일 수정

1. 항목의 **✏️** 버튼 클릭
2. 내용 수정
3. "수정" 버튼 클릭

### 할 일 삭제

1. 항목의 **🗑️** 버튼 클릭
2. 확인 알림에서 "확인" 클릭

### 순서 변경

1. 미완료 항목의 **드래그 핸들** (⋮⋮) 표시
2. 항목을 드래그하여 원하는 위치로 이동
3. 같은 태그 그룹 내에서만 이동 가능

### 날짜별 필터링

1. 상단 탭에서 **Daily/Weekly/Monthly** 선택
2. 좌우 화살표로 날짜 이동
3. 해당 날짜의 항목만 표시

### 태그 관리

1. 우측 상단 **메뉴** 버튼 클릭
2. **태그 관리** 선택
3. 각 태그 우측의 **⋮** 버튼으로 색상 변경
4. 10가지 색상 중 선택

### 검색

1. 하단 네비게이션의 **🔍** 버튼 클릭
2. 태그 선택 (선택사항)
3. 키워드 입력 (선택사항)
4. "검색" 버튼 클릭

### 배경 변경

1. 우측 상단 **메뉴** 버튼 클릭
2. **배경 설정** 선택
3. 노트/메모장/격자무늬 중 선택

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **SCSS** - 스타일링 (variables, nesting)
- **Local Storage** - 데이터 저장
- **PWA** - Progressive Web App

### 컴포넌트
- **TodoItem** - 할 일 항목 컴포넌트
- **TagInput** - 태그 자동완성 입력
- **Select** - 커스텀 셀렉트박스
- **Checkbox** - 커스텀 체크박스

### 스타일링
- **Noto Sans KR** - 한글 폰트
- **Roboto** - 영문 폰트
- **Stylelint** - CSS 린팅 및 자동 정렬

### 기능
- Drag and Drop API
- React Hooks (useState, useEffect, useRef, useCallback, useMemo)
- Date manipulation
- Local Storage persistence

## 📦 프로젝트 구조

```
todo-widget-app/
├── public/
│   ├── index.html
│   ├── logo.png              # 앱 로고
│   ├── manifest.json         # PWA 매니페스트
│   └── service-worker.js     # 서비스 워커
├── src/
│   ├── components/
│   │   ├── Checkbox.js       # 커스텀 체크박스
│   │   ├── Select.js         # 커스텀 셀렉트
│   │   ├── TagInput.js       # 태그 입력
│   │   └── TodoItem.js       # 할 일 항목
│   ├── styles/
│   │   └── _variables.scss   # SCSS 변수
│   ├── assets/
│   │   └── img/
│   │       ├── ico_logo.png  # 로고 아이콘
│   │       └── ico_write.png # 작성 아이콘
│   ├── App.js                # 메인 컴포넌트
│   ├── App.scss              # 메인 스타일
│   ├── index.js              # 엔트리 포인트
│   └── index.css             # 글로벌 스타일
├── .stylelintrc.json         # Stylelint 설정
├── package.json
└── README.md
```

## 🎨 커스터마이징

### 색상 변경

`src/styles/_variables.scss`에서 색상 변수 수정:

```scss
// Primary Colors
$primary-color: #063064;
$secondary-color: #2bae66;

// Background Colors
$bg-white: #fff;
$bg-gray: #f8f9fa;

// Text Colors
$text-dark: #2c3e50;
$text-medium: #7f8c8d;
$text-light: #bdc3c7;
```

### 배경 패턴 변경

`src/App.scss`에서 배경 타입별 스타일 수정:

```scss
.cont-todolist {
  &.note { /* 노트 스타일 */ }
  &.memo { /* 메모장 스타일 */ }
  &.grid { /* 격자무늬 스타일 */ }
}
```

### 태그 색상 팔레트 수정

`src/App.js`의 `colorPalette` 배열 수정:

```javascript
const colorPalette = [
  { name: 'Default', value: 'default', color: '#e0e0e0' },
  { name: 'Custom', value: 'custom', color: '#your-color' },
  // ... 더 추가
];
```

## 📝 개발 가이드

### 컴포넌트 추가

1. `src/components/` 폴더에 새 컴포넌트 생성
2. `App.js`에서 import
3. 필요한 props 전달

### 스타일 추가

1. `src/App.scss`에 스타일 추가
2. 변수는 `src/styles/_variables.scss`에 정의
3. Stylelint로 자동 정렬

### 상태 관리

- Local Storage를 통한 데이터 영속성
- React Hooks를 사용한 상태 관리
- useEffect로 자동 저장

## 🌟 주요 특징

### 노션 스타일 UI
- 깔끔하고 직관적인 인터페이스
- 태그별 색상 관리
- Bottom sheet 모달

### 모바일 최적화
- 터치 제스처 지원
- 반응형 레이아웃
- PWA로 앱처럼 사용

### 성능 최적화
- GPU 가속 애니메이션
- 레이아웃 최적화
- 빠른 응답 속도

### 접근성
- 키보드 네비게이션
- ARIA 레이블
- 의미 있는 HTML 구조

## 📄 라이선스

MIT License

---

© dea. All rights reserved.

**Made with ❤️ using React**
