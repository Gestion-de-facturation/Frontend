import { useEffect, useState } from 'react';
import axios from 'axios';
import { Produit } from '../types/productList';

export function useProducts() {
  const [data, setData] = useState<Produit[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/products`).then((res) => setData(res.data));
  }, []);

  return data;
}