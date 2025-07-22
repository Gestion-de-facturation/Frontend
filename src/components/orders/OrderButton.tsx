import React from 'react';
import '@/styles/form.css';
import '@/styles/order.css';

type Props = {
    handleSubmit: () => void;
}

export default function OrderButton ({
    handleSubmit
} : Props) {
    return (
    <div className="flex justify-end gap-3 form-content-mt">
        <button className="px-4 py-2 border rounded bg-gray-100 cursor-pointer w-24 h-8 font-semibold">Annuler</button>
        <button 
        onClick={handleSubmit}
        className="px-4 py-2 border rounded bg-[#14446c] text-white cursor-pointer w-24 h-8 font-semibold hover:bg-[#f18c08]">
            Enregistrer
        </button>
    </div>
    )
}