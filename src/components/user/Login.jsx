import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * 로그인 페이지 컴포넌트
 * 카카오 소셜 로그인 기능을 제공합니다.
 * 이미 로그인된 사용자는 홈으로 리다이렉트됩니다.
 */
const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 이미 로그인 상태면 홈으로 리다이렉트
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  /**
   * 카카오 소셜 로그인 처리 함수
   * 카카오 OAuth 인증 페이지로 리다이렉트합니다.
   */
  const handleKakaoLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorization/kakao`;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">대학마켓 로그인</h1>

      <div className="space-y-4">
        <p className="text-center text-gray-600 mb-4">
          대학교 인증을 통해 안전한 거래를 시작하세요!
        </p>

        {/* 카카오 로그인 버튼 */}
        <button
          onClick={handleKakaoLogin}
          className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg flex items-center justify-center"
        >
          <img src="/images/kakao_login_large_wide.png" alt="Kakao" className="w-5 h-5 mr-2" />
          카카오 계정으로 시작하기
        </button>

        {/* 약관 안내 */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>로그인하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
