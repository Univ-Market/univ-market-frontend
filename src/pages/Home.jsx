import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/product/ProductList';
import { getAllProducts } from '../services/productApi';

/**
 * 홈페이지 컴포넌트
 * 인기 상품 및 앱 특징을 소개하는 페이지입니다.
 */
const Home = () => {
  // 추천 상품 목록 및 로딩 상태
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로딩 시 추천 상품 목록 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 첫 페이지의 상품들만 가져오기 (8개 제한)
        const response = await getAllProducts({ page: 0, size: 8 });
        setFeaturedProducts(response.content);
      } catch (error) {
        console.error('상품 목록 불러오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* 히어로 섹션 - 메인 배너 */}
      <div className="bg-indigo-700 text-white rounded-lg overflow-hidden mb-8">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold mb-4">
              대학생을 위한
              <br />
              안전한 중고거래 플랫폼
            </h1>
            <p className="text-indigo-200 mb-6">
              대학교 인증을 통해 믿을 수 있는 거래를 시작하세요!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100"
              >
                상품 구경하기
              </Link>
              <Link
                to="/products/new"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg border border-white hover:bg-indigo-700"
              >
                판매 시작하기
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img src="/images/univ-market-hero.svg" alt="대학마켓" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </div>

      {/* 최신 상품 섹션 */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">최신 상품</h2>
          <Link to="/products" className="text-indigo-600 hover:underline">
            전체보기
          </Link>
        </div>
        {/* 최신 상품 목록 */}
        <ProductList products={featuredProducts} loading={isLoading} />
      </div>

      {/* 앱 특징 섹션 */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center">왜 대학마켓인가요?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 특징 1: 대학생 인증 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">대학생 인증</h3>
            <p className="text-gray-600">
              대학교 이메일을 통한 인증으로 믿을 수 있는 거래 환경을 제공합니다.
            </p>
          </div>

          {/* 특징 2: 실시간 채팅 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">실시간 채팅</h3>
            <p className="text-gray-600">
              판매자와 구매자 간의 원활한 소통을 위한 실시간 채팅 기능을 제공합니다.
            </p>
          </div>

          {/* 특징 3: 동일 대학 거래 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">동일 대학 거래</h3>
            <p className="text-gray-600">
              같은 대학교 학생들과의 거래로 만남 장소 선정이 쉽고 빠른 거래가 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
