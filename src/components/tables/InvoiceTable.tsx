'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    getPaginationRowModel,
    flexRender
} from '@tanstack/react-table';
import { Order } from '@/utils/types/orderList';
import { handleDeleteOrder } from '@/utils/handlers/order-list/handleDeleteConfirm';
import { handleDownload } from '@/utils/handlers/order-list/handleDownload';
import { OrderSearch } from '../fields/search/OrderSearch';
import { PaginationBtn } from '../buttons/PaginationBtn';
import OrderDetails from '../orders/OrderDetails';
import ConfirmModal from '../modals/ConfirmModal';
import DeliveryStatusSelect from '../buttons/DeliveryStatusSelect';
import PaymentStatusSelect from '../buttons/PaymentStatusSelect';
import { StatusDeliveryFilter } from '../fields/search/StatusDeliveryFilter';
import { StatusPaymentFilter } from '../fields/search/StatusPaymentFilter';
import { OrderTypeFilter } from '../fields/search/OrderTypeFilter';
import { LiaEye, LiaEdit } from "react-icons/lia";
import { MdOutlineFileDownload, MdOutlineDeleteOutline } from "react-icons/md";
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


    const router = useRouter();

    const handleDeleteConfirm = async() => {
        handleDeleteOrder({deleteId, mutate, setShowConfirm, setDeleteId});
    }

    const columns: ColumnDef<Order>[] = [
        { header: 'Référence', accessorKey: 'id' },
        { header: 'Adresse Livraison', accessorKey: 'adresse_livraison',
            cell: ({getValue}) => {
                const adresseLivraison = getValue<string>();
                if (adresseLivraison.length >= 50) {
                    return adresseLivraison.substring(0, 51);
                }
                return adresseLivraison;
            }
         },
        { header: 'Adresse Facturation', accessorKey: 'adresse_facturation', 
            cell: ({getValue}) => {
                const adresseFacturation = getValue<string>();
                if (adresseFacturation.length >= 50) {
                    return adresseFacturation.substring(0, 51);
                }
                return adresseFacturation;
            }
         },
        { header: 'Date', accessorKey: 'date',
            cell: ({ getValue }) => {
                const dateStr = getValue<string>();
                const dateOnly = new Date(dateStr).toLocaleDateString('fr-FR');

                return dateOnly;
            }
         },
        { header: 'Total', accessorKey: 'total', 
            cell: ({getValue}) => {
                const total = getValue<number>();
                return (
                    <p className='whitespace-nowrap'>{total} Ar</p>
                )
            }
         },
        { header: 'Livraison', accessorKey: 'statut_livraison', 
            cell: ({ row }) => {
                const statut = row.getValue('statut_livraison') as string;
                const idCommande = row.original.id;

                return (
                <DeliveryStatusSelect idCommande={idCommande} statutActuel={statut} />
                );
            }
         },
        { header: 'Paiement', accessorKey: 'statut_paiement',
            cell: ({ row }) => {
                const statut = row.getValue('statut_paiement') as string;
                const idCommande = row.original.id;

                return (
                    <PaymentStatusSelect idCommande={idCommande} statutActuel={statut}/>
                )
            }
        },
        { header: 'Type', accessorKey: 'order_type', 
            cell: ({getValue}) => {
                const order_type = getValue<string>();
                if (order_type == 'facture') {
                    return (
                        <div className='bg-[#14446c50] rounded-xl status-column'>
                            <p className='place-self-center'>{order_type}</p>
                        </div>                    
                    )
                } else {
                    return (
                        <div className='bg-[#f18c0852] rounded-xl status-column'>
                            <p className='place-self-center text-[#f18c08]'>{order_type}</p>
                        </div>
                    )
                }
            }
         },
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
                    title='Modifier'
                    onClick={() => {
                        const id = row.original.id;
                        router.push(`/dashboard/forms/update-invoice?id=${id}`);
                    }}
                    >
                        <LiaEdit className='h-5 w-5 text-[#f18c08] hover:text-shadow-[#f18c08] cursor-pointer'/>
                    </button>
                    <button 
                    title='Télécharger'
                    onClick={() => handleDownload(row.original.id)}
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
                        <MdOutlineDeleteOutline className='h-5 w-5 text-red-600 hover:text-shadow-[#f18c08] cursor-pointer'/>
                    </button>
                </div>
            )
         }
    ]

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

    return (
        <div className='invoices'>
            <div className="flex gap-2">
                <OrderSearch globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}/>
                <StatusDeliveryFilter onChange={(value) => setColumnFilters([
                    ...columnFilters.filter(f => f.id !== 'statut_livraison'),
                    value ? { id: 'statut_livraison', value } : null,
                ].filter(Boolean))}/>
                <StatusPaymentFilter onChange={(value) => setColumnFilters([
                    ...columnFilters.filter(f => f.id !== 'statut_paiement'),
                    value ? { id: 'statut_paiement', value } : null,
                ].filter(Boolean))}/>
                <OrderTypeFilter onChange={(value) => setColumnFilters([
                    ...columnFilters.filter(f => f.id !== 'order_type'),
                    value ? { id: 'order_type', value } : null,
                ].filter(Boolean))}/>
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

            <PaginationBtn table={table}/>

            {selectedCommandeId && (
                <OrderDetails orderId={selectedCommandeId} onClose={() => setSelectedCommandeId(null)} />
            )}
            {showConfirm && (
                <ConfirmModal
                    title="Confirmer la suppression"
                    message="Voulez-vous vraiment supprimer cette commande ?"
                    confirmBtn='Supprimer'
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