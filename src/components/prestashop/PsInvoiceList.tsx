'use client'

import { useState } from "react";
import { usePsOrders } from "./usePsOrders";
import { usePsOrdersSwr } from "./usePsOrdersSwr";
import PsInvoiceTable from "./PsInvoiceTable";
import '@/styles/order.css';

export default function PsInvoiceList() {
    const data = usePsOrders();
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const { data: orders, isLoading, mutate } = usePsOrdersSwr();

    if (isLoading) return <p>Chargement...</p>;

    return (
        <div className="invoice-container border border-[#cccccc] pg rounded-lg shadow-lg">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">Liste des commandes BO</h2>
            </div>
            <div>
                <PsInvoiceTable
                    data={orders}
                    mutate={mutate}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </div>
        </div>
    );
}