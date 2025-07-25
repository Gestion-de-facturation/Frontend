import React from 'react';
import '@/styles/form.css';
import '@/styles/order.css';
import { TiCancel } from "react-icons/ti";
import { FaRegSave } from "react-icons/fa";

type Props = {
    handleSubmit: () => void;
}

export default function OrderButton ({
    handleSubmit
} : Props) {
    return (
    <div className="flex justify-between order-btn-container">
        <button className="flex gap-2 border rounded bg-gray-100 cursor-pointer w-32 h-9 font-semibold order-btn-cancel hover:bg-[#ffffffda]">
            <TiCancel className='text-lg order-btn-icon'/>
            Annuler
        </button>
        <button 
        onClick={handleSubmit}
        className="flex gap-2 border rounded bg-[#14446c] text-white cursor-pointer w-32 h-9 font-semibold hover:bg-[#f18c08] order-btn-save">
            <FaRegSave className='text-lg order-btn-icon'/>
            Enregistrer
        </button>
    </div>
    )
}