import TotalInvoices from "@/components/stats/TotalInvoices";
import PaidInvoices from "@/components/stats/PaidInvoices";
import '@/styles/order.css';

export default function Stats () {
    return (
        <div className="mts">
            <div className="flex">
                <TotalInvoices />
                <PaidInvoices />
            </div>
        </div>
    );
}