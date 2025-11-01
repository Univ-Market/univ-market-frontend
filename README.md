/\*\*

- 대학마켓 프론트엔드 프로젝트 설정 가이드
-
- 이 파일은 프로젝트를 처음 설정할 때 필요한 단계들을 설명합니다.
  \*/

// 1. 프로젝트 생성
// Create React App을 사용하여 새 프로젝트 생성
// npx create-react-app univ-market-frontend

// 2. 필요한 패키지 설치
// npm install react-router-dom axios sockjs-client stompjs

// 3. Tailwind CSS 설정
// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p

// 4. tailwind.config.js 파일 설정
/\*\*

- @type {import('tailwindcss').Config}
  _/
  module.exports = {
  content: [
  "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {},
  },
  plugins: [],
  }

// 5. index.css 파일에 Tailwind 지시어 추가
/\*\*

- src/index.css
  \*/
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

// 6. 환경 변수 설정 (.env 파일)
/\*\*

- .env 파일 작성
  \*/
  REACT_APP_API_URL=http://localhost:8080/api

// 7. 폴더 구조 생성
/\*\*

- src/
- ├── components/
- │ ├── layout/
- │ ├── product/
- │ ├── user/
- │ ├── chat/
- │ └── common/
- ├── pages/
- ├── services/
- ├── utils/
- ├── hooks/
- ├── context/
- ├── App.js
- └── index.js
  \*/

// 8. 프로젝트 실행
// npm start

// 9. URL 라우팅
/\*\*

- 프로젝트의 주요 URL 경로:
- - '/': 홈페이지
- - '/login': 로그인 페이지
- - '/oauth/callback': 소셜 로그인 콜백 처리
- - '/products': 상품 목록 페이지
- - '/products/search?keyword=검색어': 상품 검색 결과
- - '/products/categories/:categoryId': 카테고리별 상품 목록
- - '/products/:id': 상품 상세 페이지
- - '/products/new': 상품 등록 페이지 (로그인 필요)
- - '/chat?roomId=:roomId': 채팅 페이지 (로그인 필요)
- - '/my-page': 사용자 프로필 페이지 (로그인 필요)
- - '/verify-university': 대학교 인증 페이지 (로그인 필요)
    \*/
