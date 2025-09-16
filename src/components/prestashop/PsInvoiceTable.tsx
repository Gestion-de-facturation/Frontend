'use client'

import { useEffect, useState } from 'react';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    getPaginationRowModel,
    flexRender
} from '@tanstack/react-table';
import { OrderSearch } from '../fields/search/OrderSearch';
import { PaginationBtn } from '../buttons/PaginationBtn';
import '@/styles/order.css';
import { PsOrder } from './PsOrder';
import { psInvoiceTableColumnsFn } from './psInvoiceTableColumnsFn';
import PsOrderDetails from './PsOrderDetails';

type Props = {
    data: PsOrder[];
    mutate: () => void;
    globalFilter: string;
    setGlobalFilter: (val: string) => void;
    pagination: { pageIndex: number; pageSize: number };
    setPagination: (val: any) => void;
};

export default function PsInvoiceTable({
    data,
    mutate,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
}: Props) {
    const [selectedCommandeId, setSelectedCommandeId] = useState<string | null>(null);
    const [columnFilters, setColumnFilters] = useState<any[]>([]);

    const columns = psInvoiceTableColumnsFn(setSelectedCommandeId);

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
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: 'includesString',
        initialState: {
            sorting: [{id: 'date_add', desc: true}]
        }
    });

    useEffect(() => {
        if (dateRange.start || dateRange.end) {
            setColumnFilters((prev) => [
                ...prev.filter(f => f.id !== 'date_add'),
                {
                    id: 'date_add',
                    value: dateRange
                }
            ]);
        } else {
            setColumnFilters((prev) => prev.filter(f => f.id !== 'date_add'));
        }
    }, [dateRange]);

    return (
        <div className='invoices'>
            <div className="flex gap-2 w-full">
                <OrderSearch globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} setDateRange={setDateRange} />
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
                <PsOrderDetails orderId={Number(selectedCommandeId)} onClose={() => setSelectedCommandeId(null)} />
            )}
        </div>
    );
}