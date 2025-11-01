import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * 카테고리 네비게이션 컴포넌트 - 상품 카테고리 메뉴와 상품 등록 버튼을 제공합니다.
 */
const Navigation = () => {
  // 현재 위치 정보를 가져와 활성화된 메뉴를 표시하기 위함
  const location = useLocation();

  /**
   * 현재 경로와 메뉴 경로를 비교해 활성화 클래스를 반환하는 함수
   * @param {string} path - 메뉴 경로
   * @returns {string} - 활성화시 적용할 CSS 클래스
   */
  const isActive = (path) => {
    return location.pathname === path ? 'bg-indigo-700' : '';
  };

  return (
    <nav className="bg-indigo-600 text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto whitespace-nowrap">
          {/* 카테고리 메뉴 */}
          <Link
            to="/products"
            className={`px-4 py-2 mx-1 rounded hover:bg-indigo-700 transition ${isActive(
              '/products',
            )}`}
          >
            전체 상품
          </Link>
          <Link
            to="/products/categories/1"
            className={`px-4 py-2 mx-1 rounded hover:bg-indigo-700 transition ${isActive(
              '/products/categories/1',
            )}`}
          >
            전자기기
          </Link>
          <Link
            to="/products/categories/2"
            className={`px-4 py-2 mx-1 rounded hover:bg-indigo-700 transition ${isActive(
              '/products/categories/2',
            )}`}
          >
            도서
          </Link>
          <Link
            to="/products/categories/3"
            className={`px-4 py-2 mx-1 rounded hover:bg-indigo-700 transition ${isActive(
              '/products/categories/3',
            )}`}
          >
            생활용품
          </Link>
          <Link
            to="/products/categories/4"
            className={`px-4 py-2 mx-1 rounded hover:bg-indigo-700 transition ${isActive(
              '/products/categories/4',
            )}`}
          >
            의류
          </Link>
          <Link
            to="/products/categories/5"
            className={`px-4 py-2 mx-1 rounded hover:bg-indigo-700 transition ${isActive(
              '/products/categories/5',
            )}`}
          >
            스포츠/레저
          </Link>

          {/* 상품 등록 버튼 - 우측 정렬 */}
          <Link
            to="/products/new"
            className="px-4 py-2 mx-1 rounded bg-green-600 hover:bg-green-700 transition ml-auto"
          >
            상품 등록
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
