import { useState, useEffect } from 'react';
import { shopService } from '../services/shopService';

export const useProducts = (params) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await shopService.getProducts(params);
        setProducts(data.data.products);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [JSON.stringify(params)]);

  return { products, loading, error, pagination };
};
