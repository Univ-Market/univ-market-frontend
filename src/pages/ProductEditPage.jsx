import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../services/productApi';
import { getCategories } from '../services/productApi'; // Assuming getCategories is in productApi
import ProductForm from '../components/product/ProductForm'; // Reusing ProductForm for editing

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const productResponse = await getProductById(id);
        setProduct(productResponse);

        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse);
      } catch (err) {
        setError('상품 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching product or categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndCategories();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await updateProduct(id, formData);
      alert('상품이 성공적으로 수정되었습니다.');
      navigate(`/products/${id}`); // 수정 후 상세 페이지로 이동
    } catch (err) {
      setError('상품 수정에 실패했습니다.');
      console.error('Error updating product:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-10">상품을 찾을 수 없습니다.</div>;
  }

  const initialValues = {
    title: product.title,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    imageUrls: product.imageUrls,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">상품 수정</h1>
      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        categories={categories}
        submitButtonText="상품 수정"
      />
    </div>
  );
};

export default ProductEditPage;
