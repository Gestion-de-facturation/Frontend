'use client'

import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/utils/types/orderList';
import { handleDownload } from '@/utils/handlers/order-list/handleDownload';
import { LiaEye, LiaEdit } from "react-icons/lia";
import { MdOutlineFileDownload, MdOutlineDeleteOutline } from "react-icons/md";
import DeliveryStatusSelect from '@/components/buttons/DeliveryStatusSelect';
import PaymentStatusSelect from '@/components/buttons/PaymentStatusSelect';
import '@/styles/order.css';

export const invoiceTableColumnsFn = (
    setSelectedCommandeId: (val: string) => void, 
    setDeleteId: (val: string) => void, 
    setShowConfirm: (val: boolean) => void
) => {
    const router = useRouter();

    const columns: ColumnDef<Order>[] = [
        { header: 'Référence', accessorKey: 'id' },
        {
            header: 'Adresse Livraison', accessorKey: 'adresse_livraison',
            cell: ({ getValue }) => {
                const adresseLivraison = getValue<string>();
                if (adresseLivraison.length >= 50) {
                    return adresseLivraison.substring(0, 51);
                }
                return adresseLivraison;
            }
        },
        {
            header: 'Adresse Facturation', accessorKey: 'adresse_facturation',
            cell: ({ getValue }) => {
                const adresseFacturation = getValue<string>();
                if (adresseFacturation.length >= 50) {
                    return adresseFacturation.substring(0, 51);
                }
                return adresseFacturation;
            }
        },
        {
            header: 'Date', accessorKey: 'date',
            cell: ({ getValue }) => {
                const dateStr = getValue<string>();
                const dateOnly = new Date(dateStr).toLocaleDateString('fr-FR');

                return dateOnly;
            }
        },
        {
            header: 'Total', accessorKey: 'total',
            cell: ({ getValue }) => {
                const total = getValue<number>();
                return (
                    <p className='whitespace-nowrap'>{total} Ar</p>
                )
            }
        },
        {
            header: 'Livraison', accessorKey: 'statut_livraison',
            cell: ({ row }) => {
                const statut = row.getValue('statut_livraison') as string;
                const idCommande = row.original.id;

                return (
                    <DeliveryStatusSelect idCommande={idCommande} statutActuel={statut} />
                );
            }
        },
        {
            header: 'Paiement', accessorKey: 'statut_paiement',
            cell: ({ row }) => {
                const statut = row.getValue('statut_paiement') as string;
                const idCommande = row.original.id;

                return (
                    <PaymentStatusSelect idCommande={idCommande} statutActuel={statut} />
                )
            }
        },
        {
            header: 'Type', accessorKey: 'order_type',
            cell: ({ getValue }) => {
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
        {
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-3 justify-center">
                    <button
                        onClick={() => setSelectedCommandeId(row.original.id)}
                        title='Voir'
                    >
                        <LiaEye className='h-5 w-5 text-[#f18c08] hover:text-shadow-[#f18c08] cursor-pointer' />
                    </button>
                    <button
                        title='Modifier'
                        onClick={() => {
                            const id = row.original.id;
                            router.push(`/dashboard/forms/update-invoice?id=${id}`);
                        }}
                    >
                        <LiaEdit className='h-5 w-5 text-[#f18c08] hover:text-shadow-[#f18c08] cursor-pointer' />
                    </button>
                    <button
                        title='Télécharger'
                        onClick={() => handleDownload(row.original.id)}
                    >
                        <MdOutlineFileDownload className='h-5 w-5 text-[#f18c08] hover:text-shadow-[#f18c08] cursor-pointer' />
                    </button>
                    <button
                        title='Supprimer'
                        onClick={() => {
                            setDeleteId(row.original.id);
                            setShowConfirm(true);
                        }}
                    >
                        <MdOutlineDeleteOutline className='h-5 w-5 text-red-600 hover:text-shadow-[#f18c08] cursor-pointer' />
                    </button>
                </div>
            )
        }
    ]

    return columns
}