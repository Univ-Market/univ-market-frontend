import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Navigation from './components/layout/Navigation';
import Home from './pages/Home';
import Login from './components/user/Login';
import OAuthCallback from './components/user/OAuthCallback';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/common/PrivateRoute';
import UnivVerification from './components/user/UnivVerification';

/**
 * 애플리케이션의 메인 컴포넌트
 *
 * 모든 라우팅 설정과 전체 레이아웃을 정의합니다.
 * - AuthProvider: 인증 컨텍스트를 제공하여 로그인 상태 관리
 * - Router: 라우팅 기능 제공
 * - Header, Navigation, Footer: 공통 레이아웃 컴포넌트
 *
 * 라우팅 구조:
 * - '/': 홈페이지
 * - '/login': 로그인 페이지
 * - '/oauth/callback': 소셜 로그인 콜백 처리
 * - '/products': 상품 목록 페이지
 * - '/products/search': 상품 검색 결과 페이지
 * - '/products/categories/:categoryId': 카테고리별 상품 목록
 * - '/products/:id': 상품 상세 페이지
 * - '/products/new': 상품 등록 페이지 (인증 필요)
 * - '/chat': 채팅 페이지 (인증 필요)
 * - '/my-page': 사용자 프로필 페이지 (인증 필요)
 * - '/verify-university': 대학교 인증 페이지 (인증 필요)
 */
function App() {
  return (
    // 전체 앱을 AuthProvider로 감싸 모든 컴포넌트에서 인증 상태 접근 가능
    <AuthProvider>
      {/* 라우팅 기능을 제공하는 Router 컴포넌트 */}
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* 상단 헤더 - 로고, 검색, 로그인/로그아웃 버튼 등 */}
          <Header />

          {/* 카테고리 네비게이션 바 */}
          <Navigation />

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-grow container mx-auto px-4 py-6">
            {/* 라우트 정의 */}
            <Routes>
              {/* 홈페이지 라우트 */}
              <Route path="/" element={<Home />} />

              {/* 로그인 관련 라우트 */}
              <Route path="/login" element={<Login />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />

              {/* 상품 관련 공개 라우트 */}
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/search" element={<ProductListPage />} />
              <Route path="/products/categories/:categoryId" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />

              {/* 상품 등록 페이지 (인증 필요) */}
              <Route
                path="/products/new"
                element={
                  <PrivateRoute>
                    <ProductCreatePage />
                  </PrivateRoute>
                }
              />

              {/* 채팅 페이지 (인증 필요) */}
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                }
              />

              {/* 마이페이지 (인증 필요) */}
              <Route
                path="/my-page"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />

              {/* 대학교 인증 페이지 (인증 필요) */}
              <Route
                path="/verify-university"
                element={
                  <PrivateRoute>
                    <UnivVerification />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>

          {/* 하단 푸터 - 저작권 정보, 링크 등 */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
