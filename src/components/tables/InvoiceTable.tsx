'use client'

import { useState } from 'react';
import axios from 'axios';
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    getPaginationRowModel,
    flexRender
} from '@tanstack/react-table';
import { Order } from '@/utils/types/orderList';
import { LiaEye } from "react-icons/lia";
import { MdOutlineFileDownload, MdOutlineDeleteOutline } from "react-icons/md";
import OrderDetails from '../orders/OrderDetails';
import ConfirmModal from '../modals/ConfirmModal';
import toast from 'react-hot-toast';
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

    const handleDeleteConfirm = async() => {
        if (!deleteId) return ;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${deleteId}`);
            toast.success('Commande supprimée');
            mutate();
        } catch (err) {
            toast.error('Erreur lors de la suppression');
        } finally {
            setShowConfirm(false);
            setDeleteId(null);
        }
    }

    const handleDownload = async (order: any) => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`);

            const produits = data.commandeProduits.map((item: any) => ({
                id: item.idProduit,
                nom: item.produit.nom,
                quantite: item.quantite,
                prixUnitaire: item.produit.prixUnitaire
            }));

            const factureBody = {
                id: data.id,
                date: data.date.substring(0, 10),
                adresseLivraison: data.adresse_livraison,
                adresseFacturation: data.adresse_facturation,
                fraisDeLivraison: data.frais_de_livraison,
                orderType: data.order_type.toUpperCase(),
                produits,
            };

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoice/create`, factureBody);
            window.open(`${process.env.NEXT_PUBLIC_API_URL}/invoice/${order.id}/download`);
        } catch (err) {
            console.error("Erreur de téléchargement: ", err);
            
        };
    }

    const columns: ColumnDef<Order>[] = [
        { header: 'Référence', accessorKey: 'id' },
        { header: 'Adresse Livraison', accessorKey: 'adresse_livraison' },
        { header: 'Adresse Facturation', accessorKey: 'adresse_facturation' },
        { header: 'Date', accessorKey: 'date',
            cell: ({ getValue }) => {
                const dateStr = getValue<string>();
                const dateOnly = new Date(dateStr).toLocaleDateString('fr-FR');

                return dateOnly;
            }
         },
        { header: 'Total (Ar)', accessorKey: 'total' },
        { header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-3 justify-center">
                    <button 
                    onClick={() => setSelectedCommandeId(row.original.id)}
                    title='Voir'
                    >
                        <LiaEye className='h-5 w-5 text-[#f18c08] hover:text-shadow-[#f18c08] cursor-pointer'/>
                    </button>
                    <button 
                    title='Télécharger'
                    onClick={() => handleDownload(row.original)}
                    >
                        <MdOutlineFileDownload className='h-5 w-5 text-[#f18c08] hover:text-shadow-[#f18c08] cursor-pointer'/>
                    </button>
                    <button 
                    title='Supprimer'
                    onClick={() => {
                        setDeleteId(row.original.id);
                        setShowConfirm(true);
                    }}
                    >
                        <MdOutlineDeleteOutline className='h-5 w-5 text-[#f18c08] hover:text-shadow-[#f18c08] cursor-pointer'/>
                    </button>
                </div>
            )
         }
    ]

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
        <div className='invoices'>
            <input 
                type="text" 
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Rechercher une commande..."
                className='border border-gray-300 h-8 mb-4 w-full rounded product-search-input mts'
            />

            <table className='border w-full mts h-64'>
                <thead className='bg-gray'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
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
                            <td key={cell.id} className='p-2 border table-element-p h-8'>
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
                    className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'    
                >
                    Précédent
                </button>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
                </span>
                <button 
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'    
                >
                    Suivant
                </button>
            </div>
            {selectedCommandeId && (
                <OrderDetails orderId={selectedCommandeId} onClose={() => setSelectedCommandeId(null)} />
            )}
            {showConfirm && (
                <ConfirmModal
                    title="Confirmer la suppression"
                    message="Voulez-vous vraiment supprimer cette commande ?"
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