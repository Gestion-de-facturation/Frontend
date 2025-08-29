'use client'

import { useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { handleDownload } from "@/utils/handlers/order-list/handleDownload";

export default function InvoiceListDownloadBtn({ orderId }: { orderId: string }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            await handleDownload(orderId);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            title='Télécharger'
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-[#f18c08] border-t-transparent rounded-full animate-spin"></div>
            ) : (<MdOutlineFileDownload className='h-5 w-5 text-[#f18c08] hover:text-shadow-[#f18c08] cursor-pointer' />)}
        </button>
    )
}