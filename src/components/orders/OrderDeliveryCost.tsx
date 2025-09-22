import React from 'react';
import '@/styles/form.css';
import '@/styles/order.css';
import { formatPrice } from '@/utils/functions/formatPrice';

type Props = {
    fraisDeLivraison: string;
    setFraisDeLivraison: (value: string) => void;
}

export default function OrderDeliveryCost({
    fraisDeLivraison,
    setFraisDeLivraison
}: Props) {
    return (
        <div className="order-delivery-cost-container border border-[#cccccc] shadow-sm rounded-md">
            <h2 className="text-xl font-bold">Frais de livraison</h2>
            <input
                type="text"
                value={formatPrice(fraisDeLivraison)}
                placeholder='0'
                onChange={(e) => setFraisDeLivraison(e.target.value.replace(/\s/g, ''))}
                className="border p-2 rounded mts w-32 h-8 form-input-padding-left" />
            <span className='span-ml'>Ar</span>
        </div>
    )
}