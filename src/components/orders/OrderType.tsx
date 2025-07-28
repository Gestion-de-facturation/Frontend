'use client'

import React from 'react';
import '@/styles/form.css';
import '@/styles/order.css';

type Option = {
    label: string;
    value: string;
}

type TypeProps = {
    orderType: string;
    setOrderType: (val: string) => void;
    optionsType: Option[];
}

export default function OrderType ({
    orderType,
    setOrderType,
    optionsType
}:TypeProps) {
    return (
        <div className='order-type-container'>
            <select id="order-type"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className='border border-[#cccccc] rounded w-32 h-8 bg-[#14446c] text-white font-medium cursor-pointer'
            > 
                {optionsType.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}