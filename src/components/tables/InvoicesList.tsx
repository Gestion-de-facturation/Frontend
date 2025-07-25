'use client'

import { useState } from "react";
import { useOrders } from "@/utils/hooks/useOrders";
import { useOrdersSwr } from "@/utils/hooks/useOrdersSwr";
import InvoiceTable from "./InvoiceTable";
import { FaFileInvoice } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import '@/styles/order.css';
import Link from "next/link";

export default function InvoicesList() {
    const data = useOrders();
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const { data: orders, isLoading, mutate } = useOrdersSwr();

    if (isLoading) return <p>Chargement ... </p>;

    return (
        <div className="invoice-container mts border border-[#ccccc] pg rounded-lg hover:shadow-lg">
            <div className="flex justify-between mts">
                <h2 className="text-2xl font-bold">Liste des commandes</h2>
                <button className="border border-[#cccccc] w-32 h-10 text-white rounded font-semibold bg-[#14446c] cursor-pointer add-order-btn hover:bg-[#f18c08] ">
                    <Link className="flex gap-2 " href='/dashboard/forms/create_invoice'><IoMdAdd className="text-lg"/>Ajouter</Link>
                </button>
            </div>

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