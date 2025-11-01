import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendVerificationEmail, verifyUnivEmail } from '../../services/userApi';

/**
 * 대학교 이메일 인증 컴포넌트
 * 2단계로 구성:
 * 1. 대학교 이메일 입력 및 인증 메일 발송
 * 2. 인증 코드 입력 및 확인
 */
const UnivVerification = () => {
  const navigate = useNavigate();
  // 입력값 상태
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  // 현재 인증 단계 (1: 이메일 입력, 2: 인증 코드 입력)
  const [step, setStep] = useState(1);
  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * 인증 이메일 발송 함수
   * @param {Event} e - 폼 제출 이벤트
   */
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');

    // 이메일 입력 확인
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    // 대학 이메일 형식 검증 (간단한 예시)
    if (!email.match(/.*\.(ac\.kr|edu)$/)) {
      setError('대학교 이메일 형식이 아닙니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 인증 이메일 발송 API 호출
      await sendVerificationEmail(email);
      // 다음 단계(인증 코드 입력)로 이동
      setStep(2);
    } catch (error) {
      console.error('이메일 전송 중 오류 발생:', error);
      setError('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 인증 코드 확인 함수
   * @param {Event} e - 폼 제출 이벤트
   */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    // 인증 코드 입력 확인
    if (!verificationCode) {
      setError('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 인증 코드 확인 API 호출
      const isVerified = await verifyUnivEmail({ email, verificationCode });
      if (isVerified) {
        alert('대학교 인증이 완료되었습니다!');
        navigate('/');
      } else {
        setError('인증에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('인증 중 오류 발생:', error);
      setError('인증에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">대학교 인증</h1>

      {step === 1 ? (
        // 1단계: 이메일 입력 폼
        <form onSubmit={handleSendEmail}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              대학교 이메일
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="university@example.ac.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              대학교 이메일을 입력하세요. (.ac.kr, .edu 등)
            </p>
          </div>

          {/* 에러 메시지 표시 */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* 인증 메일 발송 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
          >
            {isLoading ? '처리 중...' : '인증 메일 보내기'}
          </button>
        </form>
      ) : (
        // 2단계: 인증 코드 입력 폼
        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              {email}로 인증 메일을 발송했습니다. 받은 인증 코드를 입력해주세요.
            </p>
            <label htmlFor="code" className="block text-gray-700 font-medium mb-2">
              인증 코드
            </label>
            <input
              type="text"
              id="code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="6자리 인증 코드 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>

          {/* 에러 메시지 표시 */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* 이전 및 인증 버튼 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              이전
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
            >
              {isLoading ? '처리 중...' : '인증하기'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UnivVerification;
