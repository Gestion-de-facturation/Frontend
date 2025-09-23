'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "./StatsCard";
import { GiReceiveMoney } from "react-icons/gi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Order = {
  id: string;
  date: string;
  order_type: string;
  statut_paiement: string;
  total: number;
  isDeleted?: boolean;
};

export default function TotalRevenue() {
  const [total, setTotal] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);

  const fetchOrders = async (): Promise<Order[]> => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      return res.data;
    } catch (err) {
      console.error("Erreur lors de la récupération des données", err);
      return [];
    }
  };

  // Calcul du total factures payées ce mois-ci
  const calculateCurrentMonthTotal = async () => {
    const data = await fetchOrders();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filtered = data.filter(
      (order) =>
        order.order_type.toLowerCase() === "facture" &&
        order.statut_paiement.toLowerCase() === "validé" &&
        order.isDeleted === false &&
        new Date(order.date).getFullYear() === currentYear &&
        new Date(order.date).getMonth() === currentMonth
    );

    const totalThisMonth = filtered.reduce((acc, order) => acc + order.total, 0);
    setTotal(totalThisMonth);
  };

  // Calcul de la variation en % entre ce mois et le mois précédent
  useEffect(() => {
    const fetchAndComputePercentage = async () => {
      try {
        const data = await fetchOrders();

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        let totalCurrent = 0;
        let totalLast = 0;

        data.forEach((order) => {
          if (
            order.order_type.toLowerCase() === "facture" &&
            order.statut_paiement.toLowerCase() === "validé" &&
            order.isDeleted === false
          ) {
            const orderDate = new Date(order.date);
            const orderMonth = orderDate.getMonth();
            const orderYear = orderDate.getFullYear();

            if (orderMonth === currentMonth && orderYear === currentYear) {
              totalCurrent += order.total;
            } else if (orderMonth === lastMonth && orderYear === lastMonthYear) {
              totalLast += order.total;
            }
          }
        });

        if (totalLast === 0) {
          setPercentage(null);
          return;
        }

        const diff = totalCurrent - totalLast;
        const percentChange = (diff * 100) / totalLast;
        setPercentage(percentChange);
      } catch (err) {
        console.error("Erreur lors du calcul du pourcentage", err);
        setPercentage(null);
      }
    };

    fetchAndComputePercentage();
  }, []);

  useEffect(() => {
    calculateCurrentMonthTotal();
  }, []);

  return (
    <StatsCard
      title="Revenu total"
      icon={<GiReceiveMoney size={20} />}
      content={total !== null ? `${total.toLocaleString()} Ar` : "chargement..."}
      percentage={percentage !== null ? `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%` : "chargement..."}
    />
  );
}
