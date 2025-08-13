'use client'

import { CiEdit } from "react-icons/ci";
import '@/styles/order.css';
import '@/styles/invoice.css';
import Link from "next/link";

type TitleProps = {
    orderId: string;
}

export const OrderDetailsTitle = ({orderId} : TitleProps) => {
    
    return (
        <div className='flex gap-2 h-[5vh]'>
            <h2 className="text-2xl font-bold text-[#f18c08]">Détails de la commande</h2>
            <Link 
            title='Modifier'
            href={`/dashboard/forms/update-invoice?id=${orderId}`}
            className='order-details-edit-btn'
            >
            <CiEdit className='h-6 w-6 text-[#f18c08] font-sm hover:text-shadow-[#f18c08] cursor-pointer order-details-edit-icon'/>
            </Link>
        </div>        
    );
}