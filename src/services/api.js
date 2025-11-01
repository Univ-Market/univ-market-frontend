import axios from 'axios';

/**
 * 기본 API 클라이언트 설정
 * 모든 API 요청의 기본 URL과 헤더를 설정합니다.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 * 모든 요청에 인증 토큰을 추가합니다.
 */
api.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token');
    if (token) {
      // 헤더에 인증 토큰 추가
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('config test', config)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * 응답 인터셉터
 * 응답 데이터 처리 및 에러 핸들링을 합니다.
 */
api.interceptors.response.use(
  (response) => {
    // 응답 데이터 반환
    return response.data;
  },
  (error) => {
    // 401 에러(인증 실패) 처리
    if (error.response && error.response.status === 401) {
      // 토큰 제거 및 로그인 페이지로 리다이렉트
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
