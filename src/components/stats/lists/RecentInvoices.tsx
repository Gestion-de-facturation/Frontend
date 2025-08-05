'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ViewAll } from "@/components/buttons/ViewAll";
import { Order } from "@/utils/types/orderDetails/Order";
import { LiaEye, LiaEdit } from "react-icons/lia";
import '@/styles/stats.css';
import OrderDetails from "@/components/orders/OrderDetails";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const RecentInvoices = () => {
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [selectedCommandeId, setSelectedCommandeId] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const res = await axios.get(`${API_URL}/orders`);
                setRecentOrders(res.data.slice(0, 3));
            } catch (error) {
                console.error("Erreur lors du chargement des commandes: ", error);
            }
        };

        fetchRecentOrders();
    }, []);

    return (
        <div className="border border-[#cccccc] shadow-md hover:shadow-lg rounded-md recent-invoices">
            <div className="flex justify-between">
                <h2 className="font-bold text-xl">Commandes Récentes</h2>
                <ViewAll target="/dashboard/invoices"/>
            </div>
            <div>
                {recentOrders.map((order) => (
                    <div 
                    className="flex justify-between invoices-list"
                    key={order.id}
                    >
                        <div>
                            <h3 className="font-semibold">
                                {order.id} {" "} 
                                <span className={order.statut_livraison === "livré"
                                    ? "text-green-600" 
                                    : order.statut_livraison === "en_cours"
                                    ? "text-blue-600"
                                    : order.statut_livraison === "annulé"
                                    ? "text-red-600"
                                    : "text-orange-600"
                                }>
                                    {order.statut_livraison === 'en_cours'
                                    ? 'en cours' : order.statut_livraison}
                                </span> 
                            </h3>
                            <p>{order.adresse_livraison}</p>
                            <p>{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="recent-invoice-amount-container">
                            <p className="font-semibold">{order.total} Ar</p>
                        </div>
                        <div className="flex gap-2 text-[#f18c08] recent-invoice-icons">
                            <LiaEye
                            onClick={() => setSelectedCommandeId(order.id)} 
                            size={20}
                            className="cursor-pointer"/>
                            <LiaEdit 
                            size={20}
                            onClick={() => {
                                const id = order.id;
                                router.push(`/dashboard/forms/update-invoice?id=${id}`);
                                }}
                            className="cursor-pointer"/>
                        </div>
                    </div>
                ))}
            </div>

            {selectedCommandeId && (
                <OrderDetails orderId={selectedCommandeId} onClose={() => setSelectedCommandeId(null)} />
            )}
            
        </div>
    )
}