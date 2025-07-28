'use client';

import React from 'react';
import '@/styles/form.css';
import '@/styles/order.css';

type Option = {
    label: string;
    value: string;
}

type StatutsProps = {
    statutLivraison: string;
    setStatutLivraison: (val: string) => void;
    statutPaiement: string;
    setStatutPaiement: (val: string) => void;
    optionsLivraison: Option[];
    optionsPaiement: Option[];
}

export default function OrderStatus ({
    statutLivraison,
    setStatutLivraison, 
    statutPaiement,
    setStatutPaiement,
    optionsLivraison,
    optionsPaiement
} : StatutsProps) {
    return (
        <div className='border border-[#cccccc] rounded-md order-status-container'>
            <h2 className='text-xl font-bold'>Statuts de la commande</h2>
            <div className="flex justify-between">
                <div className="flex gap-2 mts delivery-status-container">
                    <label className="block font-medium status-label">Statut de livraison: </label>
                    <select 
                    id="delivery-status"
                    value={statutLivraison}
                    onChange={(e) => setStatutLivraison(e.target.value)}
                    className='border border-[#cccccc] rounded status-select'>
                        {optionsLivraison.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 mts delivery-status-container">
                    <label className="block font-medium status-label">Statut de paiement: </label>
                    <select 
                    id="delivery-status"
                    value={statutPaiement}
                    onChange={(e) => setStatutPaiement(e.target.value)}
                    className='border border-[#cccccc] rounded status-select'>
                       {optionsPaiement.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                       ))}
                    </select>
                </div>
            </div>
        </div>
    )
}