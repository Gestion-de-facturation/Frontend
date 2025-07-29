'use client';

import { useRouter, usePathname } from 'next/navigation';
import '@/styles/sidebar.css'
import { LogOut } from 'lucide-react';
import { MdReceipt, MdReceiptLong, MdOutlineAddBox  } from "react-icons/md";
import {  AiFillProduct } from "react-icons/ai";
import CreateInvoiceBtn from './buttons/CreateInvoiceBtn';
import Link from 'next/link';

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <aside className="flex flex-col w-48 bg-gray-100 text-white h-screen p-4 border-r-1 border-[#CCCCCC] side-bar-container fixed top-0 left-0 z-50">
            <div className='border-b-1 border-[#CCCCCC] h-16'>
                <h2 className="text-3xl font-semibold place-self-center logo">
                    <strong className='text-[#14446c]'>Best</strong>
                    <strong className='text-[#f18c08]'>place</strong>
                </h2>
            </div>
            <ul className="place-self-center">
                <div className='sidebar-links mt-link'>
                   <li><Link href="/dashboard/forms/create_invoice"><CreateInvoiceBtn /></Link></li> 
                </div>
                <div className='sidebar-links mt-link'>
                    <li><Link 
                    href="/dashboard" 
                    className={`flex text-[#14446c] text-lg side-bar-content hover:text-[#f18c08] ${
                        pathname === "/dashboard" ? 'text-[#f18c08]' : 'text-[#14446c]'
                    }`}><AiFillProduct className='w-5 h-5 link-icon'/>Produits</Link></li>
                </div>
                <div className='sidebar-links'>
                    <li><Link 
                    href="/dashboard/invoices" 
                    className={`flex text-[#14446c]  text-lg side-bar-content hover:text-[#f18c08] ${
                        pathname === "/dashboard/invoices" ? 'text-[#f18c08]' : 'text-[#14446c]'
                    }`}><MdReceiptLong className='w-5 h-5 link-icon'/>Commandes</Link></li>
                </div>
            </ul>
            <div className='logout-btn-container'>
                <button
                className=" flex gap-1 bg-transparent text-red-600 font-semibold p-2 cursor-pointer rounded-md h-10 w-36 disconnect-btn"
                onClick={() => {
                localStorage.removeItem('isLoggedIn');
                router.push('/login');
                }}
                >
                <LogOut/> Déconnexion
                </button>
            </div>
        </aside>
    )
}