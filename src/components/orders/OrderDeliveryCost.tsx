import React from 'react';
import '@/styles/form.css';
import '@/styles/order.css';

type Props = {
    fraisDeLivraison: string;
    setFraisDeLivraison: (value: string) => void;
}

export default function OrderDeliveryCost ({
    fraisDeLivraison,
    setFraisDeLivraison
} : Props) {
    return (
        <div className="mb-4 form-content-mt">
            <label className="block font-medium mb-1">Frais de livraison</label>
            <input 
            type="number" 
            value={fraisDeLivraison}
            onChange={(e) => setFraisDeLivraison(e.target.value)}
            className="border p-2 rounded mts w-32 h-8" />
            <span className='span-ml'>Ar</span>
        </div>
    )
}