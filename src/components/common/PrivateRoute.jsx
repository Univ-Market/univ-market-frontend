import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 보호할 자식 컴포넌트
 */
const PrivateRoute = ({ children }) => {
  // 인증 정보 가져오기
  const { isAuthenticated, loading } = useAuth();

  // 인증 정보 로딩 중일 때 로딩 표시
  if (loading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return children;
};

export default PrivateRoute;
