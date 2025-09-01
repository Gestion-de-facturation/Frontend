'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "./StatsCard";
import { LiaFileInvoiceSolid } from "react-icons/lia";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Order = {
    id: string;
    date: string;
    order_type: string;
    isDeleted?: boolean;
};

export default function TotalInvoices() {
    const [total, setTotal] = useState<number | null>(null);
    const [percentage, setPercentage] = useState<number | null>(null);

    useEffect(() => {
        const fetchAndCompute = async () => {
            try {
                const res = await axios.get(`${API_URL}/orders`);
                const data: Order[] = res.data;

                const grouped: { [key: string]: number } = {};
                data.forEach(order => {
                    const dateObj = new Date(order.date);
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
                    const key = `${year}-${month}`;
                    grouped[key] = (grouped[key] || 0) + 1;
                });

                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
                const currentKey = `${currentYear}-${currentMonth}`;
                if (!(currentKey in grouped)) {
                    grouped[currentKey] = 0;
                }

                const sortedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

                if (sortedMonths.length < 2) {
                    setPercentage(null);
                    return;
                }

                const moisActuel = grouped[sortedMonths[0]];
                const moisPrecedent = grouped[sortedMonths[1]];

                if (moisPrecedent === 0) {
                    setPercentage(null);
                    return;
                }

                const diff = moisActuel - moisPrecedent;
                const percentChange = (diff * 100) / moisPrecedent;

                setPercentage(percentChange);
            } catch (err) {
                console.error("Erreur lors de la récupération ou du calcul", err);
            }
        };

        fetchAndCompute();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/orders`);
            return res.data;
        } catch (err) {
            console.error('Erreur lors de la récupération des données', err);
            return [];
        }
    };

    const countInvoices = async () => {
        const data = await fetchOrders();

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const filtered = data.filter((order: Order) => {
            const orderDate = new Date(order.date);
            return (
                orderDate.getFullYear() === currentYear &&
                orderDate.getMonth() === currentMonth &&
                order.order_type?.toLowerCase() === "facture" &&
                order.isDeleted === false
            );
        });

        return filtered.length;
    };

    useEffect(() => {
        countInvoices().then(setTotal);
    }, []);

    return (
        <StatsCard
            title={"Total des factures"}
            icon={<LiaFileInvoiceSolid size={20} />}
            content={total !== null ? `${total}` : 'chargement...'}
            percentage={percentage !== null ? `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%` : "chargement..."} />

    )
}