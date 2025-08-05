import { ViewAll } from "@/components/buttons/ViewAll";
import { LiaEye, LiaEdit } from "react-icons/lia";
import '@/styles/stats.css';

export const RecentInvoices = () => {
    return (
        <div className="border border-[#cccccc] shadow-md hover:shadow-lg rounded-md recent-invoices">
            <div className="flex justify-between">
                <h2 className="font-bold text-xl">Commandes Récentes</h2>
                <ViewAll />
            </div>
            <div>
                <div className="flex justify-between invoices-list">
                    <div>
                        <h3 className="font-semibold">FA250724100705823 <span className="text-green-600">livré</span> </h3>
                        <p>Tanà</p>
                        <p>24/07/2025</p>
                    </div>
                    <div className="recent-invoice-amount-container">
                        <p className="font-semibold">116100 Ar</p>
                    </div>
                    <div className="flex gap-2 text-[#f18c08] recent-invoice-icons">
                        <LiaEye size={20}/>
                        <LiaEdit size={20}/>
                    </div>
                </div>
                <div className="flex justify-between invoices-list">
                    <div>
                        <h3 className="font-semibold">FA250801074249810 <span className="text-green-600">livré</span> </h3>
                        <p>Alarobia</p>
                        <p>01/08/2025</p>
                    </div>
                    <div className="recent-invoice-amount-container">
                        <p className="font-semibold">44500 Ar</p>
                    </div>
                    <div className="flex gap-2 text-[#f18c08] recent-invoice-icons">
                        <LiaEye size={20}/>
                        <LiaEdit size={20}/>
                    </div>
                </div>
                <div className="flex justify-between invoices-list">
                    <div>
                        <h3 className="font-semibold">FA250804143606121 <span className="text-blue-600">en cours</span> </h3>
                        <p>Ambohitsaina</p>
                        <p>	04/08/2025</p>
                    </div>
                    <div className="recent-invoice-amount-container">
                        <p className="font-semibold">64500 Ar</p>
                    </div>
                    <div className="flex gap-2 text-[#f18c08] recent-invoice-icons">
                        <LiaEye size={20}/>
                        <LiaEdit size={20}/>
                    </div>
                </div>
            </div>
        </div>
    )
}