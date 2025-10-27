// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * 헤더 컴포넌트 - 상단 네비게이션 바와 검색 기능을 제공합니다.
 * 로그인 상태에 따라 다른 메뉴를 보여줍니다.
 */
const Header = () => {
  // 검색어 입력값을 관리하는 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  // 인증 정보를 가져오는 커스텀 훅
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /**
   * 검색 폼 제출 시 실행되는 함수
   * 검색 키워드가 있을 경우, 검색 결과 페이지로 이동합니다.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products/search?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  return (
    <header className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* 로고 및 홈페이지 링크 */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
            <img src="/images/univ-market-logo.svg" alt="대학마켓" className="h-20" />
            </Link>
          </div>

          {/* 검색 폼 */}
          <div className="flex-1 mx-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="상품 검색"
                className="px-4 py-2 w-full text-gray-700 rounded-l-md"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-indigo-800 px-4 py-1.5 rounded-r-md hover:bg-indigo-900"
              >
                검색
              </button>
            </form>
          </div>

          {/* 로그인 상태에 따른 메뉴 표시 */}
          <div className="flex items-center">
            {isAuthenticated ? (
              // 로그인된 상태
              <>
                <Link to="/chat" className="mr-4">
                  채팅
                </Link>
                <Link to="/my-page" className="mr-4">
                  마이페이지
                </Link>
                <button onClick={logout} className="hover:underline">
                  로그아웃
                </button>
              </>
            ) : (
              // 로그인되지 않은 상태
              <Link to="/login" className="hover:underline">
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
