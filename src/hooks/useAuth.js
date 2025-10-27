import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * 인증 상태와 관련 함수를 제공하는 커스텀 훅
 * AuthContext의 값을 쉽게 접근할 수 있도록 합니다.
 *
 * @returns {Object} 인증 컨텍스트 값 (user, isAuthenticated, login, logout 등)
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
