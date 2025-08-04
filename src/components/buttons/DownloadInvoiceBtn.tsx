import { PiDownloadSimpleBold } from "react-icons/pi";
import '@/styles/button.css';

type ButtonProps = {
    onClick : () => void;
}

export const DownloadInvoiceBtn = ({onClick} : ButtonProps) => {
    return (
        <div className="invoice-download-btn-container">
            <button 
            className="flex gap-2 bg-[#f18c08] text-white border border-[#cccccc] font-semibold rounded-md cursor-pointer invoice-download-btn"
            onClick={onClick}
            >
                <PiDownloadSimpleBold size={20} />
                Télécharger la facture
            </button>
        </div>
    )
}