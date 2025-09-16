'use client'

import { useEffect, useState } from "react";
import { handlePsDownload } from "./handlePsDownload";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { DownloadPsInvoiceBtn } from "./DownloadPsInvoiceBtn";
import '@/styles/order.css';
import '@/styles/invoice.css';

type Props = {
    orderId: number;
    onClose: () => void;
};

type PsOrder = {
    id: number;
    reference: string;
    date_add: string;
    payment: string;
    current_state: string;
    module: string;
    total_paid_tax_incl: string;
    total_products_wt: string;
    fraisDeLivraison: string;
    adresseLivraison: {
        firstname: string;
        lastname: string;
        company: string;
        address1: string;
        postcode: string;
        city: string;
        phone: string;
        country: string;
        state: string;
    };
    adresseFacturation: {
        firstname: string;
        lastname: string;
        company: string;
        address1: string;
        postcode: string;
        city: string;
        phone: string;
        country: string;
        state: string;
    };
    produits: {
        id: string;
        nom: string;
        quantite: number;
        prixUnitaire: number;
    }[];
    carrier: string;
    invoiceNumber: string | null;
}

export default function PsOrderDetails({ orderId, onClose }: Props) {
    const [order, setOrder] = useState<PsOrder | null>(null);
    const [loadingDownload, setLoadingDownload] = useState(false);

    const handleDownloadWithLoader = async () => {
        try {
            setLoadingDownload(true);
            await handlePsDownload(orderId);
        } finally {
            setLoadingDownload(false);
        }
    };

    useEffect(() => {
        const fetchPsOrder = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/prestashop/psOrders/${orderId}`
                );
                setOrder(res.data);
            } catch (err) {
                console.error('Erreur de chargement de la commande', err);
            }
        };
        fetchPsOrder();
    }, [orderId]);

    if (!order) return null;
    const totalProduits = order.produits.reduce(
        (acc, p) => acc + p.quantite * p.prixUnitaire,
        0
    );

    return (
        <div className="transition-opacity duration-300 opacity-100">
            <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-start z-50 p-6 overflow-y-auto">
                <div className="bg-[#ffffffbe] rounded-lg shadow-lg p-6 w-full max-w-3xl relative details-container max-h-[80vh] overflow-y-auto scrollbar-hide">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-600 hover:text-red-500 cursor-pointer"
                        title="fermer"
                    >
                        <MdClose size={24} />
                    </button>

                    <div className="flex justify-between gap-2">
                        <h2 className="text-xl font-bold">Commande #{order.id}</h2>
                        <p className="rounded-xl bg-blue-600 text-white px-3 py-1">{order.payment}</p>
                    </div>

                    <div className="mb-4 space-y-1 mts details-header">
                        <p><strong>Référence: </strong>{order.reference}</p>
                        <p><strong>N° facture: </strong>{order.invoiceNumber ?? '_'}</p>
                        <p><strong>Date: </strong>{new Date(order.date_add).toLocaleDateString('fr-FR')}</p>
                        <p><strong>Transporteur: </strong>{order.carrier}</p>
                        <p><strong>Adresse de livraison: </strong>{`${order.adresseLivraison.firstname} ${order.adresseLivraison.lastname} \n ${order.adresseLivraison.company} \n ${order.adresseLivraison.address1}, ${order.adresseLivraison.city} ${order.adresseLivraison.postcode}, ${order.adresseLivraison.country}`}</p>
                        <p><strong>Adresse de facturation: </strong>{`${order.adresseFacturation.firstname} ${order.adresseFacturation.lastname} \n ${order.adresseFacturation.company} \n ${order.adresseFacturation.address1}, ${order.adresseFacturation.city} ${order.adresseFacturation.postcode}, ${order.adresseFacturation.country}`}</p>
                    </div>

                    <div className="mb-4 mts">
                        <h3 className="text-lg font-semibold mb-2">Produits</h3>
                        <ul className="space-y-2">
                            {order.produits.map((item, idx) => (
                                <li
                                    key={`${item.id}-${idx}`}
                                    className="flex justify-between border-b pb-2"
                                >
                                    <div>
                                        <p className="font-medium">{item.nom}</p>
                                        <p className="text-sm text-gray-600">
                                            {(item.quantite * item.prixUnitaire).toLocaleString()} Ar
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        {(item.quantite * item.prixUnitaire).toLocaleString()} Ar
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mts text-right space-y-1">
                        <p><strong>Total produits: </strong>{totalProduits.toLocaleString()} Ar</p>
                        <p><strong>Frais de livraison: </strong>{Number(order.fraisDeLivraison).toLocaleString()} Ar</p>
                        <p className="text-lg font-bold">
                            <strong>Total général: </strong> {Number(order.total_paid_tax_incl).toLocaleString()} Ar
                        </p>
                        <DownloadPsInvoiceBtn
                            onClick={handleDownloadWithLoader}
                            loading={loadingDownload}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}