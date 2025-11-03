import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/product/ProductForm';
import { createProduct, getCategories } from '../services/productApi';

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (err) {
        setError('카테고리를 불러오는데 실패했습니다.');
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (productData) => {
    try {
      const response = await createProduct(productData);
      navigate(`/products/${response.id}`);
    } catch (err) {
      setError('상품 등록에 실패했습니다.');
      console.error('Error creating product:', err);
    }
  };

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ProductForm
        onSubmit={handleSubmit}
        categories={categories}
        submitButtonText="상품 등록"
      />
    </div>
  );
};

export default ProductCreatePage;