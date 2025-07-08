'use client'

import { useState } from "react";
import { useOrders } from "@/utils/hooks/useOrders";
import InvoiceTable from "./InvoiceTable";
import { FaFileInvoice } from "react-icons/fa";
import '@/styles/order.css';

export default function InvoicesList() {
    const data = useOrders();
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

    return (
        <div className="invoice-container mts border border-[#ccccc] pg rounded-lg hover:shadow-lg">
            <h2 className="flex flex-row justify-between text-2xl font-bold  mts">
                Liste des factures <FaFileInvoice className='w-8 h-8 text-[#cccccc] hover:text-[#14446c]'/>
            </h2>

            <div>
                <InvoiceTable 
                    data={data}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </div>
        </div>
    )
}