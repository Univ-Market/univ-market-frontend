import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPresignedUrl } from '../../services/uploadApi';
import { getCategories, createProduct } from '../../services/productApi';

/**
 * 상품 등록 폼 컴포넌트
 * 제목, 가격, 카테고리, 설명, 이미지 등의 입력을 받아 상품을 등록합니다.
 */
const ProductForm = () => {
  const navigate = useNavigate();
  // 폼 입력값 상태
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  // 이미지 관련 상태
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // 폼 유효성 검사 에러
  const [errors, setErrors] = useState({});

  /**
   * 초기 로딩 시 카테고리 목록을 가져옵니다.
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (error) {
        console.error('카테고리 불러오기 오류:', error);
      }
    };

    fetchCategories();
  }, []);

  /**
   * 이미지 선택 처리 함수
   * 선택된 이미지 파일을 상태에 저장하고 미리보기를 생성합니다.
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // 최대 5개 이미지로 제한
    if (images.length + files.length > 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
      return;
    }

    // 미리보기 URL 생성
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  /**
   * 이미지 삭제 처리 함수
   */
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));

    // 미리보기 URL 해제 및 상태 업데이트
    URL.revokeObjectURL(previews[index]);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  /**
   * 이미지 업로드 처리 함수
   * S3 Presigned URL을 사용하여 이미지를 업로드합니다.
   * @returns {Promise<Array>} 업로드된 이미지 URL 배열
   */
  const uploadImages = async () => {
    if (images.length === 0) return [];

    setIsUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of images) {
        // Presigned URL 발급
        const presignedData = await getPresignedUrl(file.name, file.type);

        // S3에 이미지 업로드
        await fetch(presignedData.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        uploadedUrls.push(presignedData.fileUrl);
      }
      return uploadedUrls;
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      throw new Error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * 폼 유효성 검사 함수
   * @returns {boolean} 유효성 검사 통과 여부
   */
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = '제목을 입력해주세요.';
    if (!price) newErrors.price = '가격을 입력해주세요.';
    if (isNaN(Number(price)) || Number(price) < 0) newErrors.price = '유효한 가격을 입력해주세요.';
    if (!description.trim()) newErrors.description = '상품 설명을 입력해주세요.';
    if (!categoryId) newErrors.categoryId = '카테고리를 선택해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 폼 제출 처리 함수
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 이미지 업로드
      const imageUrls = await uploadImages();

      // 상품 등록 데이터 구성
      const productData = {
        title,
        price: Number(price),
        description,
        categoryId: Number(categoryId),
        imageUrls,
      };

      // 상품 등록 API 호출
      const response = await createProduct(productData);

      // 등록 완료 후 상세 페이지로 이동
      navigate(`/products/${response.id}`);
    } catch (error) {
      console.error('상품 등록 오류:', error);
      alert('상품 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">상품 등록</h1>

      <form onSubmit={handleSubmit}>
        {/* 제목 입력 */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            제목
          </label>
          <input
            type="text"
            id="title"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="상품 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* 가격 입력 */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
            가격
          </label>
          <div className="relative">
            <input
              type="text"
              id="price"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="가격을 입력하세요"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))} // 숫자만 입력 가능
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              원
            </span>
          </div>
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* 카테고리 선택 */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            카테고리
          </label>
          <select
            id="category"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
        </div>

        {/* 상품 설명 입력 */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            상품 설명
          </label>
          <textarea
            id="description"
            rows="6"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="상품에 대한 자세한 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* 이미지 업로드 영역 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">상품 이미지</label>

          {/* 이미지 미리보기 및 추가 버튼 */}
          <div className="flex flex-wrap gap-4 mb-4">
            {/* 이미지 미리보기 */}
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`미리보기 ${index + 1}`}
                  className="w-32 h-32 object-cover border rounded-lg"
                />
                {/* 이미지 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}

            {/* 이미지 추가 버튼 (5개 미만일 때만 표시) */}
            {previews.length < 5 && (
              <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                <span className="mt-2 text-sm text-gray-500">이미지 추가</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  multiple
                />
              </label>
            )}
          </div>

          <p className="text-sm text-gray-500">이미지는 최대 5개까지 업로드 가능합니다.</p>
        </div>

        {/* 제출 버튼 영역 */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)} // 이전 페이지로 이동
            className="px-6 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
          >
            {isLoading || isUploading ? '처리 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
