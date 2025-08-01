import TotalInvoices from "@/components/stats/TotalInvoices";
import PaidInvoices from "@/components/stats/PaidInvoices";
import TotalRevenue from "@/components/stats/TotalRevenue";
import '@/styles/order.css';

export default function Stats () {
    return (
        <div className="mts">
            <div className="flex">
                <TotalInvoices />
                <PaidInvoices />
                <TotalRevenue />
            </div>
        </div>
    );
}