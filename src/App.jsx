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
 * 라우팅 설정 및 전체 레이아웃 구조를 정의합니다.
 */
function App() {
  return (
    // AuthProvider로 전체 앱을 감싸서 인증 상태를 모든 컴포넌트에서 사용 가능하게 함
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* 공통 헤더 */}
          <Header />
          {/* 카테고리 네비게이션 */}
          <Navigation />
          {/* 메인 컨텐츠 영역 */}
          <main className="flex-grow container mx-auto px-4 py-6">
            <Routes>
              {/* 공개 페이지 */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/search" element={<ProductListPage />} />
              <Route path="/products/categories/:categoryId" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />

              {/* 인증이 필요한 페이지들 - PrivateRoute로 보호 */}
              <Route
                path="/products/new"
                element={
                  <PrivateRoute>
                    <ProductCreatePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-page"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
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
          {/* 공통 푸터 */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
