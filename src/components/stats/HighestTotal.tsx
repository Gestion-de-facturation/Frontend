'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "./StatsCard";
import { GiTakeMyMoney } from "react-icons/gi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


type Order = {
    id: string;
    date: string;
    order_type: string;
    statut_paiement: string;
    total: number;
};

export default function HighestTotal () {
    const [maxTotal, setMaxTotal] = useState<number | null>(null);
    const [variation, setVariation] = useState<number | null>(null);

    useEffect(() => {
        const fetchAndCompute = async () => {
            try {
                const res = await axios.get(`${API_URL}/orders`);
                const data: Order[] = res.data;

                const facturesPayees = data.filter(
                    (order) => order.order_type === 'facture' && order.statut_paiement === 'validé'
                );

                const grouped: Record<string, number[]> = {};
                facturesPayees.forEach(order => {
                    const dateObj = new Date(order.date);
                    if (isNaN(dateObj.getTime())) return;
                    const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
                    if (!grouped[key]) grouped[key] = [];
                    grouped[key].push(order.total);
                });

                const sortedMonths = Object.keys(grouped).sort(
                    (a, b) => new Date(b).getTime() - new Date(a).getTime()
                );

                if (sortedMonths.length < 1) {
                    setMaxTotal(null);
                    setVariation(null);
                    return;
                }

                const currentMonth = sortedMonths[0];
                const currentMax = Math.max(...grouped[currentMonth]);

                setMaxTotal(currentMax);

                if (sortedMonths.length >= 2) {
                    const prevMonth = sortedMonths[1];
                    const prevMax = Math.max(...grouped[prevMonth]);

                    if (prevMax !== 0) {
                        const variationValue = ((currentMax - prevMax) * 100) / prevMax;
                        setVariation(variationValue);
                    } else {
                        setVariation(null);
                    }
                } else {
                    setVariation(null);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données");
                setMaxTotal(null);
                setVariation(null);
            }
        };

        fetchAndCompute();
    }, []);

    return (
        <StatsCard 
        title={"Total max"} 
        icon={<GiTakeMyMoney size={20}/>} 
        content={maxTotal !== null ? `${maxTotal.toLocaleString()} Ar` : "chargement..."} 
        percentage={
            variation !== null ? `${variation?.toFixed(2)}%` : "chargement..."
        } />
    )
}