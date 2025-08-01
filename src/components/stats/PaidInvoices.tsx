'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "./StatsCard";
import { MdOutlinePaid } from "react-icons/md";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Order = {
    id: string;
    date: string;
    order_type: string;
    statut_paiement: string;
}

export default function PaidInvoices () {
    const [count, setCount] = useState<number | null>(null);
    const [percentage, setPercentage] = useState<number | null>(null);

    const fetchPaidInvoices = async () => {
        try {
            const res = await axios.get(`${API_URL}/orders`);
            const data: Order[] = res.data;

            const paidInvoices  = data.filter(
                (order) => order.order_type === "facture" && order.statut_paiement === "validé" 
            );

            return paidInvoices;
        } catch (err) {
            console.error("Erreur lors de la récupération des données");
            return [];
        }
    };

    useEffect(() => {
        const fetchAndCompute = async () => {
            try {
               const paidInvoices = await fetchPaidInvoices();
               setCount(paidInvoices.length);

               const grouped: Record<string, number> = {};
               paidInvoices.forEach(order => {
                const dateObj = new Date(order.date);
                if (isNaN(dateObj.getTime())) return ;
                const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
                grouped[key] = (grouped[key] || 0) + 1;
               });

               const sortedKeys = Object.keys(grouped).sort(
                (a, b) => new Date(b).getTime() - new Date(a).getTime()
               );

               if(sortedKeys.length < 2) {
                setPercentage(null);
                return;
               }

               const current = grouped[sortedKeys[0]];
               const previous = grouped[sortedKeys[1]];

               if (previous === 0) {
                setPercentage(null);
                return ;
               }

               const variation = ((current - previous) * 100) / previous;
               setPercentage(variation);
            } catch (err) {
                console.error("Erreur lors de la récupération ou du calcul", err);
                setPercentage(null);
            }
        };

        fetchAndCompute();
    }, []);

    return (
        <StatsCard 
        title={"Factures payées"} 
        icon={<MdOutlinePaid size={20}/>} 
        content={count !== null ? `${count}` : 'chargement'} 
       percentage={
                percentage !== null
                    ? `${percentage.toFixed(2)}`
                    : "chargement..."
            }  />
    );
}