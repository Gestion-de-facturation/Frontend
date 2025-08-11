import TotalInvoices from "@/components/stats/TotalInvoices";
import PaidInvoices from "@/components/stats/PaidInvoices";
import TotalRevenue from "@/components/stats/TotalRevenue";
import HighestTotal from "@/components/stats/HighestTotal";
import { LineChartsRevenue } from "@/components/stats/graphs/LineChartsRevenue";
import { RecentInvoices } from "@/components/stats/lists/RecentInvoices";
import '@/styles/order.css';
import '@/styles/stats.css'

export default function Stats () {
    return (
        <div className="mts">
             <h2 className="text-2xl font-bold dashboard-title">Tableau de bord</h2>
            <div className="flex justify-evenly gap-2 mts">
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