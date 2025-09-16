'use client'

import { useState } from "react"
import { handlePsDownload } from "./handlePsDownload";
import { MdOutlineFileDownload } from "react-icons/md";

export default function PsInvoiceListDownloadBtn({ orderId }: { orderId: number }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            await handlePsDownload(orderId);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            title="Télécharger le facture"
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-[#f18c08] border-t-transparent rounded-full animate-spin"></div>
            ) : (<MdOutlineFileDownload className="h-5 w-5 text-[#f18c08] cursor-pointer" />)}
        </button>
    )
}