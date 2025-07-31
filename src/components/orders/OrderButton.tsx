import React, { useState } from 'react';
import ConfirmModal from '../modals/ConfirmModal';
import { TiCancel } from "react-icons/ti";
import { FiRotateCw } from 'react-icons/fi';
import { FaRegSave } from "react-icons/fa";
import '@/styles/form.css';
import '@/styles/order.css';

type Props = {
    handleSubmit: () => void;
    handleCancel: () => void;
}

export default function OrderButton ({
    handleSubmit,
    handleCancel,
} : Props) {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
    <div className="flex justify-between order-btn-container">
        <button 
        onClick={() => {
            setShowConfirm(true);
        }}
        className="flex gap-2 border rounded bg-gray-100 cursor-pointer w-32 h-9 font-semibold order-btn-cancel hover:bg-[#ffffffda]"
        >
            <FiRotateCw className='text-lg order-btn-icon'/>
            Effacer
        </button>
        <button 
        onClick={handleSubmit}
        className="flex gap-2 border rounded bg-[#14446c] text-white cursor-pointer w-32 h-9 font-semibold hover:bg-[#f18c08] order-btn-save">
            <FaRegSave className='text-lg order-btn-icon'/>
            Enregistrer
        </button>
        {showConfirm && (
            <ConfirmModal 
                title="Annulation de la saisie"
                message='Voulez-vous vraiment annuler la saisie de la commande?'
                confirmBtn='Oui'
                cancelBtn='Non'
                onConfirm={() => {
                    handleCancel();
                    setShowConfirm(false);
                }}
                onCancel={() => {
                    setShowConfirm(false);
                }}
            />
        )}
    </div>
    )
}