'use client';

import { useState } from 'react';
import { useProducts } from '@/utils/hooks/useProducts';
import ProductTable from './ProductTable';
import { MdListAlt } from "react-icons/md";
import '@/styles/order.css';

export default function ProductsList() {
  const data = useProducts();
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  return (
    <div className="order">
        <div className='border border-[#cccccc] rounded-lg shadow-md productlist-section'>
            <h2 className="flex flex-row justify-between text-2xl font-bold mb-4 mts">
              Liste des produits<MdListAlt className='w-8 h-8 text-[#14446c]' />
            </h2>
            <ProductTable
                data={data}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
      </div>
        
  );
}