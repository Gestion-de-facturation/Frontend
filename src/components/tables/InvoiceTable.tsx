'use client'

import { useEffect, useState } from 'react';
import {
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    getPaginationRowModel,
    flexRender
} from '@tanstack/react-table';
import { Order } from '@/utils/types/orderList';
import { handleDeleteOrder } from '@/utils/handlers/order-list/handleDeleteConfirm';
import { invoiceTableColumnsFn } from '@/utils/functions/invoice-table/invoiceTableColumnsFn';
import { OrderSearch } from '../fields/search/OrderSearch';
import { PaginationBtn } from '../buttons/PaginationBtn';
import OrderDetails from '../orders/OrderDetails';
import ConfirmModal from '../modals/ConfirmModal';
import { StatusDeliveryFilter } from '../fields/search/StatusDeliveryFilter';
import { StatusPaymentFilter } from '../fields/search/StatusPaymentFilter';
import { OrderTypeFilter } from '../fields/search/OrderTypeFilter';
import '@/styles/order.css';

type Props = {
    data: Order[];
    mutate: () => void;
    globalFilter: string;
    setGlobalFilter: (val: string) => void;
    pagination: { pageIndex: number; pageSize: number };
    setPagination: (val: any) => void;
};

export default function InvoiceTable({
    data,
    mutate,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
}: Props) {
    const [selectedCommandeId, setSelectedCommandeId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [columnFilters, setColumnFilters] = useState<any[]>([]);

    const handleDeleteConfirm = async () => {
        handleDeleteOrder({ deleteId, mutate, setShowConfirm, setDeleteId });
    }

    const columns = invoiceTableColumnsFn(setSelectedCommandeId, setDeleteId, setShowConfirm);

    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: "",
        end: "",
    });


    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, pagination, columnFilters },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
    });

    useEffect(() => {
        if (dateRange.start || dateRange.end) {
            setColumnFilters((prev) => [
                ...prev.filter(f => f.id !== 'date'),
                {
                    id: 'date',
                    value: dateRange
                }
            ]);
        } else {
            setColumnFilters((prev) => prev.filter(f => f.id !== 'date'));
        }
    }, [dateRange]);

    return (
        <div className='invoices'>
            <div className="flex gap-2">
                <OrderSearch globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} setDateRange={setDateRange} />
                <StatusDeliveryFilter onChange={(value) => setColumnFilters([
                    ...columnFilters.filter(f => f.id !== 'statut_livraison'),
                    value ? { id: 'statut_livraison', value } : null,
                ].filter(Boolean))} />
                <StatusPaymentFilter onChange={(value) => setColumnFilters([
                    ...columnFilters.filter(f => f.id !== 'statut_paiement'),
                    value ? { id: 'statut_paiement', value } : null,
                ].filter(Boolean))} />
                <OrderTypeFilter onChange={(value) => setColumnFilters([
                    ...columnFilters.filter(f => f.id !== 'order_type'),
                    value ? { id: 'order_type', value } : null,
                ].filter(Boolean))} />
            </div>

            <table className='border w-full mts h-64'>
                <thead className='bg-gray'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                            key={headerGroup.id}
                            className='h-8'
                        >
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className='p-2 border'>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className='p-2 border table-element-p h-10'>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <PaginationBtn table={table} />

            {selectedCommandeId && (
                <OrderDetails orderId={selectedCommandeId} onClose={() => setSelectedCommandeId(null)} />
            )}
            {showConfirm && (
                <ConfirmModal
                    title="Confirmer l'archivage de la commande"
                    message="Voulez-vous vraiment archiver cette commande ?"
                    confirmBtn='Archiver'
                    cancelBtn='Annuler'
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => {
                        setShowConfirm(false);
                        setDeleteId(null);
                    }}
                />
            )}
        </div>
    );
}