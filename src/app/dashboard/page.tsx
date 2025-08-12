'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TotalInvoices from "@/components/stats/TotalInvoices";
import PaidInvoices from "@/components/stats/PaidInvoices";
import TotalRevenue from "@/components/stats/TotalRevenue";
import HighestTotal from "@/components/stats/HighestTotal";
import { jwtDecode } from 'jwt-decode';
import { LineChartsRevenue } from "@/components/stats/graphs/LineChartsRevenue";
import { RecentInvoices } from "@/components/stats/lists/RecentInvoices";
import '@/styles/order.css';
import '@/styles/stats.css'

export default function Stats() {
    const router = useRouter();

    useEffect(() => {
        console.log("useEffect exécutée")
        const token = localStorage.getItem('token');
        console.log('Token dans dashboard:', token);
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            type JwtPayload = { exp: number };
            const decoded = jwtDecode<JwtPayload>(token);

            // exp est en secondes, on multiplie par 1000 pour comparer en ms
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                router.push('/login');
            }
        } catch (error) {
            // Si token invalide, on supprime et redirige
            localStorage.removeItem('token');
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="mts">
            <h2 className="text-2xl font-bold dashboard-title">Tableau de bord</h2>
            <div className="flex justify-evenly gap-2 mts all-stats">
                <TotalInvoices />
                <PaidInvoices />
                <TotalRevenue />
                <HighestTotal />
            </div>
            <div className="flex justify-around chart">
                <LineChartsRevenue />
                <RecentInvoices />
            </div>
        </div>
    );
}