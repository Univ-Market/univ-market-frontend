import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserProducts } from '../../services/productApi';

/**
 * 사용자 프로필 및 판매 내역 컴포넌트
 * 사용자 정보와 등록한 상품 목록을 표시합니다.
 */
const Profile = () => {
  const { user } = useAuth();
  // 내 상품 목록 및 로딩 상태
  const [myProducts, setMyProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로딩 시 사용자 상품 목록 가져오기
  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const products = await getUserProducts();
        setMyProducts(products);
      } catch (error) {
        console.error('상품 목록 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProducts();
  }, []);

  // 사용자 정보가 없을 경우 로딩 표시
  if (!user) {
    return (
      <div className="text-center py-10">
        <p>사용자 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 사용자 정보 섹션 */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

        <div className="flex items-center">
          {/* 사용자 프로필 이미지 */}
          <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mr-6">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
                {user.nickname?.charAt(0)}
              </div>
            )}
          </div>

          {/* 사용자 기본 정보 */}
          <div>
            <h2 className="text-xl font-semibold">{user.nickname}</h2>
            <p className="text-gray-600">{user.email}</p>

            {/* 대학교 인증 상태 표시 */}
            <div className="mt-2 flex items-center">
              {user.isVerified ? (
                // 인증된 경우
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {user.universityName} 인증됨
                </span>
              ) : (
                // 인증되지 않은 경우
                <Link
                  to="/verify-university"
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  대학교 인증 필요
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 판매 내역 섹션 */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">내 판매 내역</h3>

        {/* 로딩 중 */}
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-2">상품을 불러오는 중...</p>
          </div>
        ) : myProducts.length === 0 ? (
          // 판매 내역이 없는 경우
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">판매 내역이 없습니다.</p>
            <Link
              to="/products/new"
              className="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              상품 등록하기
            </Link>
          </div>
        ) : (
          // 판매 내역 표시
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등록일
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myProducts.map((product) => (
                  <tr key={product.id}>
                    {/* 상품 이미지 및 제목 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {product.imageUrls && product.imageUrls.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={product.imageUrls[0]}
                              alt={product.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {product.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* 가격 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Intl.NumberFormat('ko-KR').format(product.price)}원
                      </div>
                    </td>
                    {/* 상태 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'WAITING'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'RESERVED'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.status === 'WAITING'
                          ? '판매중'
                          : product.status === 'RESERVED'
                          ? '예약중'
                          : '판매완료'}
                      </span>
                    </td>
                    {/* 등록일 */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    {/* 상세보기 링크 */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
