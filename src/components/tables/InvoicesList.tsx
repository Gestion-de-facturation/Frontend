'use client'

import { useState } from "react";
import { useOrders } from "@/utils/hooks/useOrders";
import { useOrdersSwr } from "@/utils/hooks/useOrdersSwr";
import InvoiceTable from "./InvoiceTable";
import { FaFileInvoice } from "react-icons/fa";
import '@/styles/order.css';

export default function InvoicesList() {
    const data = useOrders();
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const { data: orders, isLoading, mutate } = useOrdersSwr();

    if (isLoading) return <p>Chargement ... </p>;

    return (
        <div className="invoice-container mts border border-[#ccccc] pg rounded-lg hover:shadow-lg">
            <h2 className="flex flex-row justify-between text-2xl font-bold  mts">
                Liste des commandes <FaFileInvoice className='w-8 h-8 text-[#cccccc] hover:text-[#14446c]'/>
            </h2>

            <div>
                <InvoiceTable 
                    data={orders}
                    mutate={mutate}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </div>
        </div>
    )
}