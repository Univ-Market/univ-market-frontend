import React from 'react';
import ProductItem from './ProductItem';

/**
 * 상품 목록을 표시하는 컴포넌트
 * 로딩 상태나 상품이 없는 상태를 처리합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.products - 표시할 상품 목록 배열
 * @param {boolean} props.loading - 로딩 상태 여부
 */
const ProductList = ({ products, loading }) => {
  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2">상품을 불러오는 중...</p>
      </div>
    );
  }

  // 상품이 없을 때 표시할 UI
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">등록된 상품이 없습니다.</p>
      </div>
    );
  }

  // 상품 목록 표시
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
