'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Order } from '@/utils/types/orderDetails/Order';
import { displayStatut } from '@/utils/functions/displayStatut';
import { handleDownload } from '@/utils/handlers/order-list/handleDownload';
import { DownloadInvoiceBtn } from '../buttons/DownloadInvoiceBtn';
import { OrderDetailsTitle } from '../fields/title/OrderDetailsTitle';
import { MdClose } from 'react-icons/md';
import '@/styles/order.css';
import '@/styles/invoice.css';

type Props = {
  orderId: string;
  onClose: () => void;
};

export default function OrderDetails({ orderId, onClose }: Props) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Erreur de chargement de la commande', err);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return null;

  const totalProduits = order.commandeProduits.reduce(
    (acc, p) => acc + p.quantite * p.produit.prixUnitaire,
    0
  );

  return (
    <div className={`transition-opacity duration-300 ${order ? 'opacity-100' : 'opacity-0'}`}>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-start z-50 p-6 overflow-y-auto">
        <div className="bg-[#ffffffbe] rounded-lg shadow-lg p-6 w-full max-w-3xl relative details-container max-h-[80vh] overflow-y-auto scrollbar-hide">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          >
            <MdClose size={24} />
          </button>

          <div className='flex justify-between gap-2'>
            <OrderDetailsTitle orderId={order.id} />
            <div className='flex gap-2'>
              <p className={`${displayStatut(order.statut_livraison).statut_bg_color} rounded-xl text-white status-type-details h-8`}>
                {displayStatut(order.statut_livraison).statut_title}
              </p>
              <p className={`${displayStatut(order.statut_paiement).statut_bg_color} rounded-xl text-white status-type-details h-8`}>
                { displayStatut(order.statut_paiement).statut_title }
              </p>
            </div>
          </div>

          <div className="mb-4 space-y-1 mts details-header">
            <p><strong>Référence :</strong> {order.reference}</p>
            <p><strong>Date :</strong> {new Date(order.date).toLocaleDateString('fr-FR')}</p>
            <p><strong>Type: </strong> {order.order_type} </p>
            <p><strong>Adresse de livraison :</strong> {order.adresse_livraison}</p>
            <p><strong>Adresse de facturation :</strong> {order.adresse_facturation}</p>
          </div>

          <div className="mb-4 mts">
            <h3 className="text-lg font-semibold mb-2">Produits</h3>
            <ul className="space-y-2">
              {order.commandeProduits.map((item, idx) => (
                <li key={`${item.idProduit}-${idx}`} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.produit.nom}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantite} × {item.produit.prixUnitaire.toLocaleString()} Ar
                    </p>
                  </div>
                  <p className="font-semibold">
                    {(item.quantite * item.produit.prixUnitaire).toLocaleString()} Ar
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mts text-right space-y-1">
            <p><strong>Total produits :</strong> {totalProduits.toLocaleString()} Ar</p>
            <p><strong>Frais de livraison :</strong> {order.frais_de_livraison.toLocaleString()} Ar</p>
            <p className="text-lg font-bold"><strong>Total général :</strong> {order.total.toLocaleString()} Ar</p>
            <DownloadInvoiceBtn onClick={() => handleDownload(orderId)}/>
          </div>
        </div>
      </div>
    </div>
  );
}
