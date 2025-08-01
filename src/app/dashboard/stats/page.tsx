import TotalInvoices from "@/components/stats/TotalInvoices";
import '@/styles/order.css';

export default function Stats () {
    return (
        <div className="mts">
            <div>
                <TotalInvoices />
            </div>
        </div>
    );
}