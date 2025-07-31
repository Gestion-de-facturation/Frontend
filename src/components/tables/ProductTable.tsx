'use client';

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Produit } from '@/utils/types/productList';
import '@/styles/order.css'

type Props = {
  data: Produit[];
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (val: any) => void;
};

export default function ProductTable({
  data,
  globalFilter,
  setGlobalFilter,
  pagination,
  setPagination,
}: Props) {

  const columns: ColumnDef<Produit>[] = [
    { header: 'Référence', accessorKey: 'id' },
    { header: 'Nom', accessorKey: 'nom' },
    { header: 'Prix Unitaire (AR)', accessorKey: 'prixUnitaire' },
    { header: 'Catégorie', accessorKey: 'categorie.nom' },
    {header: 'Fournisseur', accessorKey: 'fournisseur.nom'}
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
            <tr 
            key={headerGroup.id}
            className='h-8'
            >
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
