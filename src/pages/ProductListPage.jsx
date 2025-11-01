import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProductList from '../components/product/ProductList';
import { getAllProducts, searchProducts, getProductsByCategory } from '../services/productApi';

/**
 * 상품 목록 페이지 컴포넌트
 * 전체 상품, 카테고리별 상품, 검색 결과 등을 표시합니다.
 */
const ProductListPage = () => {
  // 상품 목록 및 페이지네이션 상태
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // URL 파라미터 추출
  const { categoryId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword');

  // 페이지 로딩 시 상품 목록 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let response;

        // 검색 조건에 따라 다른 API 호출
        if (keyword) {
          // 검색 키워드가 있는 경우
          response = await searchProducts(keyword, { page: currentPage, size: 20 });
        } else if (categoryId) {
          // 카테고리별 조회
          response = await getProductsByCategory(categoryId, { page: currentPage, size: 20 });
        } else {
          // 전체 상품 조회
          response = await getAllProducts({ page: currentPage, size: 20 });
        }

        // 응답 데이터 설정
        setProducts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('상품 목록 불러오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  }, [categoryId, keyword, currentPage]);

  /**
   * 페이지 변경 처리 함수
   * @param {number} page - 이동할 페이지 번호
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /**
   * 페이지 제목 생성 함수
   * @returns {string} - 현재 조건에 맞는 페이지 제목
   */
  const getPageTitle = () => {
    if (keyword) {
      return `"${keyword}" 검색 결과`;
    } else if (categoryId) {
      const categoryNames = {
        1: '전자기기',
        2: '도서',
        3: '생활용품',
        4: '의류',
        5: '스포츠/레저',
      };
      return categoryNames[categoryId] || '상품 목록';
    } else {
      return '전체 상품';
    }
  };

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
        {totalElements > 0 && (
          <p className="text-gray-500 mt-1">총 {totalElements}개의 상품이 있습니다.</p>
        )}
      </div>

      {/* 상품 목록 */}
      <ProductList products={products} loading={isLoading} />

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center">
            {/* 이전 페이지 버튼 */}
            <button
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded-md border border-gray-300 mr-2 hover:bg-gray-50 disabled:opacity-50"
            >
              이전
            </button>

            {/* 페이지 번호 버튼 */}
            <div className="flex">
              {[...Array(Math.min(5, totalPages)).keys()].map((i) => {
                // 현재 페이지 주변 페이지 표시 로직
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i;
                } else if (currentPage < 3) {
                  pageToShow = i;
                } else if (currentPage > totalPages - 3) {
                  pageToShow = totalPages - 5 + i;
                } else {
                  pageToShow = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageToShow}
                    onClick={() => handlePageChange(pageToShow)}
                    className={`w-8 h-8 mx-1 rounded-md ${
                      currentPage === pageToShow
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageToShow + 1}
                  </button>
                );
              })}
            </div>

            {/* 다음 페이지 버튼 */}
            <button
              onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 rounded-md border border-gray-300 ml-2 hover:bg-gray-50 disabled:opacity-50"
            >
              다음
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
