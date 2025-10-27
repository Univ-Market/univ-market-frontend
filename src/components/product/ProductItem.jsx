import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';

/**
 * 개별 상품 아이템을 표시하는 컴포넌트
 * 상품 이미지, 제목, 가격, 판매 상태 등을 표시합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.product - 표시할 상품 정보
 */
const ProductItem = ({ product }) => {
  /**
   * 상품 상태에 따른 배지 클래스를 반환하는 함수
   * @returns {string} - 상태에 맞는 CSS 클래스
   */
  const getBadgeClass = () => {
    switch (product.status) {
      case 'WAITING':
        return 'bg-green-500'; // 판매중 - 초록색
      case 'RESERVED':
        return 'bg-yellow-500'; // 예약중 - 노란색
      case 'COMPLETED':
        return 'bg-gray-500'; // 판매완료 - 회색
      default:
        return 'bg-green-500';
    }
  };

  /**
   * 상품 상태에 대한 텍스트를 반환하는 함수
   * @returns {string} - 상태 텍스트
   */
  const getStatusText = () => {
    switch (product.status) {
      case 'WAITING':
        return '판매중';
      case 'RESERVED':
        return '예약중';
      case 'COMPLETED':
        return '판매완료';
      default:
        return '판매중';
    }
  };

  // 기본 이미지 설정 - 상품 이미지가 없을 경우 사용
  const defaultImage = '/images/default-product.png';
  const imageUrl =
    product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : defaultImage;

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          {/* 상품 이미지 */}
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = defaultImage;
            }} // 이미지 로드 실패시 기본 이미지로 대체
          />
          {/* 상품 상태 표시 배지 */}
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded ${getBadgeClass()}`}
          >
            {getStatusText()}
          </span>
        </div>

        {/* 상품 정보 */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
          <p className="mt-1 text-lg font-bold text-indigo-600">{formatPrice(product.price)}원</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm text-gray-500">{product.categoryName}</span>
            <span className="text-sm text-gray-500">{product.sellerNickname}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
