'use client'

import { ColumnDef } from "@tanstack/react-table"
import { PsOrder } from "./PsOrder"
import { LiaEye } from "react-icons/lia"
import PsInvoiceListDownloadBtn from "./PsInvoiceListDownloadBtn"

export const psInvoiceTableColumnsFn = (
    setSelectedCommandeId: (val: string) => void,
) => {
    const columns: ColumnDef<PsOrder>[] = [
        { header: "Référence", accessorKey: 'reference' },
        {
            header: 'Adresse Livraison', accessorKey: 'adresseLivraison',
            cell: ({ getValue }) => {
                const adresse = getValue() as PsOrder['adresseLivraison'];

                if (!adresse) return "";

                return (
                    <div>
                        <div>{adresse.lastname} {adresse.firstname}</div>
                        {adresse.company && <div>{adresse.address1}</div>}
                        <div>{adresse.address2}</div>
                    </div>
                )
            }
        },
        {
            header: 'Adresse Facturation', accessorKey: 'adresseFacturation',
            cell: ({ getValue }) => {
                const adresse = getValue() as PsOrder['adresseFacturation'];

                if (!adresse) return "";

                return (
                    <div>
                        <div>{adresse.lastname} {adresse.firstname}</div>
                        {adresse.company && <div>{adresse.address1}</div>}
                        <div>{adresse.address2}</div>
                    </div>
                )
            }
        },
        {
            header: 'Date', accessorKey: 'date_add',
            cell: info => {
                const date = new Date(info.getValue() as string);
                return date.toISOString().split('T')[0];
            },
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue.start && !filterValue.end) return true;

                const rowDate = new Date(row.getValue(columnId));
                if (isNaN(rowDate.getTime())) return false;

                const start = filterValue.start ? new Date(filterValue.start) : null;
                const end = filterValue.end ? new Date(filterValue.end) : null;

                if (start && rowDate < start) return false;
                if (end && rowDate > end) return false;

                return true;
            }
        },
        {
            header: 'Total', accessorKey: 'total_paid_tax_incl',
            cell: ({ getValue }) => {
                const total = Number(getValue<string>());

                const formattedTotal = total.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
                return (
                    <p className="whitespace-nowrap">{formattedTotal} Ar</p>
                )
            }
        },
        {
            header: 'Mode paiement', accessorKey: 'payment'
        },
        {
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 justify-center">
                    <button
                        onClick={() => setSelectedCommandeId(row.original.id)}
                        title='Voir'
                    >
                        <LiaEye className='h-5 w-5 text-[#f18c08] hover:text-shadow-[#f18c08] cursor-pointer' />
                    </button>

                    <PsInvoiceListDownloadBtn orderId={Number(row.original.id)} />
                </div>
            )
        }
    ]

    return columns;
}