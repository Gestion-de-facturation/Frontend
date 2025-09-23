'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import '@/styles/stats.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Order = {
  date: string;
  order_type: string;
  statut_paiement: string;
  total: number;
  isDeleted?: boolean;
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const LineChartsRevenue = () => {
  const [data, setData] = useState<{ name: string; revenu: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders`);
        const orders: Order[] = res.data;

        const currentYear = new Date().getFullYear();

        // Initialiser chaque mois à 0
        const revenueByMonth = Array(12).fill(0);

        orders.forEach(order => {
          if (
            order.order_type.toLowerCase() === "facture" &&
            order.statut_paiement.toLowerCase() === "validé" &&
            order.isDeleted === false
          ) {
            const orderDate = new Date(order.date);
            const year = orderDate.getFullYear();
            const month = orderDate.getMonth(); // 0 = Janvier

            if (year === currentYear) {
              revenueByMonth[month] += order.total;
            }
          }
        });

        // Construire le tableau pour Recharts
        const chartData = revenueByMonth.map((revenu, index) => ({
          name: monthNames[index],
          revenu,
        }));

        setData(chartData);
      } catch (err) {
        console.error("Erreur lors de la récupération ou du traitement des données :", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='border border-[#cccccc] rounded-md shadow-md hover:shadow-xl line-chart-container'>
      <h2 className='font-bold text-xl'>Revenu par mois</h2>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        className='mts'
      >
        <CartesianGrid stroke='none' />
        <Line type="monotone" dataKey="revenu" stroke="#14446c" strokeWidth={2} />
        <XAxis dataKey="name" />
        <YAxis width="auto" label={{ value: 'Revenu', position: 'insideLeft', angle: -90 }} />
        <Legend align="right" />
      </LineChart>
    </div>
  );
};
