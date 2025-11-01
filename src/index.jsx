import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tailwind CSS 스타일 임포트
import App from './App';

/**
 * 리액트 애플리케이션의 진입점
 * React 18의 createRoot API를 사용하여 App 컴포넌트를 DOM에 렌더링합니다.
 *
 * StrictMode로 감싸서 개발 중 잠재적인 문제를 식별하는 데 도움을 줍니다.
 * - 안전하지 않은 생명주기 메서드 감지
 * - 레거시 문자열 ref API 사용 경고
 * - 권장되지 않는 findDOMNode 사용 감지
 * - 예상치 못한 부작용 감지
 * - 레거시 context API 감지
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
