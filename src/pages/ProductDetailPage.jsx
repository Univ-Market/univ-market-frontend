import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/product/ProductDetail';
import { getProductById } from '../services/productApi';

/**
 * 상품 상세 페이지 컴포넌트
 * 개별 상품의 상세 정보를 표시합니다.
 */
const ProductDetailPage = () => {
  // URL에서 상품 ID 추출
  const { id } = useParams();
  // 상품 정보 및 로딩/에러 상태
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 페이지 로딩 시 상품 상세 정보 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError('');

      try {
        // 상품 상세 정보 API 호출
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('상품 상세 정보 불러오기 오류:', err);
        setError('상품 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div>
      {/* ProductDetail 컴포넌트에 상품 정보 전달 */}
      <ProductDetail product={product} isLoading={isLoading} error={error} />
    </div>
  );
};

export default ProductDetailPage;
