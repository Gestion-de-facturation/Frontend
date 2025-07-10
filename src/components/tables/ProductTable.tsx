'use client';

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { GiCheckMark } from "react-icons/gi";
import { Produit } from '@/utils/types/productList';
import '@/styles/order.css'

type Props = {
  data: Produit[];
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
  addProduct: (produit: Produit, quantite: number) => void;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (val: any) => void;
};

export default function ProductTable({
  data,
  globalFilter,
  setGlobalFilter,
  addProduct,
  pagination,
  setPagination,
}: Props) {
  const [quantiteInput, setQuantiteInput] = useState<{ [id: string]: number }>({});
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const columns: ColumnDef<Produit>[] = [
    { header: 'Référence', accessorKey: 'id' },
    { header: 'Nom', accessorKey: 'nom' },
    { header: 'Prix Unitaire (AR)', accessorKey: 'prixUnitaire' },
    { header: 'Catégorie', accessorKey: 'categorie.nom' },
    {
      header: 'Action',
      cell: ({ row }) => {
        const produit = row.original;

        if (selectedProductId === produit.id) {
          return (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={quantiteInput[produit.id] || 0}
                onChange={(e) =>
                  setQuantiteInput((prev) => ({
                    ...prev,
                    [produit.id]: Number(e.target.value),
                  }))
                }
                className="w-16 px-2 py-1 border rounded"
              />
              <button
                onClick={() => {
                  addProduct(produit, quantiteInput[produit.id] || 0);
                  setSelectedProductId(null);
                }}
                className="text-white px-2 py-1 rounded"
              >
                <GiCheckMark className="w-5 h-5 text-[#f18c08]" />
              </button>
            </div>
          );
        }

        return (
          <button
            onClick={() => setSelectedProductId(produit.id)}
            className="cursor-pointer .add-icon"
            title="Ajouter à la commande"
          >
            <MdAdd className="w-5 h-5 text-[#f18c08]" />
          </button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
  });

  return (
    <div className="mt-8">
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Rechercher un produit..."
        className="border border-gray-300 h-8 mb-4 w-full rounded product-search-input mts"
      />

      <table className="border w-full mts h-[50vh]">
        <thead className="bg-gray">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="pil border">
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
                <td key={cell.id} className="p-2 border table-element-p h-[4vh]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mts">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
