import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import { MdAdd } from 'react-icons/md';
import { Produit } from '@/utils/types/productList';
import '@/styles/order.css';

type Props = {
  data: Produit[];
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
  addProduct: (p: Produit) => void;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (val: any) => void;
};

export default function ProductTable({ data, globalFilter, setGlobalFilter, addProduct, pagination, setPagination }: Props) {
  const columns: ColumnDef<Produit>[] = [
    { header: 'Référence', accessorKey: 'id' },
    { header: 'Nom', accessorKey: 'nom' },
    { header: 'Prix Unitaire (AR)', accessorKey: 'prixUnitaire' },
    { header: 'Fournisseur', accessorKey: 'fournisseur.nom' },
    { header: 'Catégorie', accessorKey: 'categorie.nom' },
    {
      header: 'Action',
      cell: ({ row }) => (
        <button
          onClick={() => addProduct(row.original)}
          className="cursor-pointer ml-8 addBtn"
          title="Ajouter à la commande"
        >
          <MdAdd className="w-4 h-4 text-[#f18c08] addIcon" />
        </button>
      )
    }
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
    globalFilterFn: 'includesString'
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

      <table className="border w-full mts">
        <thead className="bg-gray">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-2 border">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-2 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span>Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}</span>
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