import { PiDownloadSimpleBold } from "react-icons/pi";
'@s/tyles/button.css';

type ButtonProps = {
    onClick: () => void;
    loading?: boolean;
}

export const DownloadPsInvoiceBtn = ({ onClick, loading }: ButtonProps) => {
    return (
        <div className="invoice-download-btn-container">
            <button
                className="flex gap-2 bg-[#f18c08] text-white border border-[#cccccc] font-semibold rounded-md cursor-pointer invoice-download-btn"
                onClick={onClick}
                disabled={loading}
            >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <PiDownloadSimpleBold size={20} />}
                Télécharger la facture
            </button>
        </div>
    )
}