import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPresignedUrl } from '../../services/uploadApi';

const ProductForm = ({ initialValues, onSubmit, categories = [], submitButtonText }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setPrice(initialValues.price || '');
      setDescription(initialValues.description || '');
      setCategoryId(initialValues.categoryId || '');
      setPreviews(initialValues.imageUrls || []);
    }
  }, [initialValues]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (images.length + files.length > 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // If the image to be removed is an existing image (from initialValues),
    // we need to handle it differently. For simplicity, we just remove from previews.
    // A more robust solution would involve tracking original and new images separately.
    if (typeof previews[index] === 'string' && previews[index].startsWith('http')) {
        // This is a previously uploaded image, we just remove it from the preview
    } else {
        URL.revokeObjectURL(previews[index]);
    }

    setImages(newImages);
    setPreviews(newPreviews);
  };

  const uploadImages = async () => {
    if (images.length === 0) return previews; // Return existing images if no new ones are added

    setIsUploading(true);
    const uploadedUrls = [];

    // Separate new files from existing urls
    const newFiles = images.filter(image => image instanceof File);
    const existingUrls = previews.filter(preview => typeof preview === 'string');


    try {
        for (const file of newFiles) {
            const presignedData = await getPresignedUrl(file.name, file.type);
            await fetch(presignedData.uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });
            uploadedUrls.push(presignedData.fileUrl);
        }
        return [...existingUrls, ...uploadedUrls];
    } catch (error) {
        console.error('이미지 업로드 오류:', error);
        throw new Error('이미지 업로드에 실패했습니다.');
    } finally {
        setIsUploading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const imageUrls = await uploadImages();
      const productData = {
        title,
        price: Number(price),
        description,
        categoryId: Number(categoryId),
        imageUrls,
      };
      await onSubmit(productData);
    } catch (error) {
      console.error('상품 처리 오류:', error);
      alert('상품 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{submitButtonText}</h1>

      <form onSubmit={handleSubmit}>
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
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              원
            </span>
          </div>
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

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

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">상품 이미지</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`미리보기 ${index + 1}`}
                  className="w-32 h-32 object-cover border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
          >
            {isLoading || isUploading ? '처리 중...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;