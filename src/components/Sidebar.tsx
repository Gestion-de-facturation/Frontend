'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CreateInvoiceBtn from './buttons/CreateInvoiceBtn';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { TbClipboardList } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { MdReceiptLong } from "react-icons/md";
import '@/styles/sidebar.css'

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('sidebarMinimized');
        if (stored === 'true') {
            setIsMinimized(true);
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isMinimized;
        setIsMinimized(newState);
        localStorage.setItem('sidebarMinimized', newState.toString());
    }

    return (
        <aside className={`flex flex-col  ${isMinimized ? 'w-20' : 'w-48'} bg-gray-100 text-white h-screen p-4 border-r-1 border-[#CCCCCC] side-bar-container fixed top-0 left-0 z-50`}>

            <div className="flex justify-evenly border-b-1 border-[#CCCCCC] ">
                <div className='h-16'>
                    <h2 className="text-3xl font-semibold place-self-center logo">
                        {isMinimized ? (
                            <>
                                <strong className='text-[#14446C]'>B</strong>
                                <strong className='text-[#f18c08]'>P</strong>
                            </>
                        ) : (
                            <>
                                <strong className='text-[#14446c]'>Best</strong>
                                <strong className='text-[#f18c08]'>place</strong>
                            </>
                        )}
                    </h2>
                </div>
                <div className="flex justify-end minimisation-btn">
                    <button
                        onClick={toggleSidebar}
                        className='text-[#14446c] hover:text-[#f18c08] transition'
                        title={isMinimized ? "Agrandir" : "Réduire"}
                    >
                        {isMinimized ? <ChevronRight /> : <ChevronLeft />}
                    </button>
                </div>
            </div>

            <ul className="place-self-center">
                <div className='sidebar-links mt-link'>
                    <li>
                        <Link 
                        href="/dashboard/forms/create_invoice">
                            <CreateInvoiceBtn minimized={isMinimized} />
                        </Link>
                    </li>
                </div>
                <div className='sidebar-links mt-link'>
                    <li>
                        <Link
                            href="/dashboard"
                            className={`flex text-[#14446c] text-lg side-bar-content hover:text-[#f18c08] ${pathname === "/dashboard" ? 'text-[#f18c08]' : 'text-[#14446c]'
                                }`}
                            title={isMinimized ? "Tableau de bord" : ""}>
                            <RxDashboard className={`${isMinimized ? 'w-9 h-9 minimized-icon': 'w-5 h-5'} link-icon`} />
                            {!isMinimized && "Tableau de bord"}
                        </Link>
                    </li>
                </div>
                <div className='sidebar-links mt-link'>
                    <li>
                        <Link
                            href="/dashboard/products"
                            className={`flex text-[#14446c] text-lg side-bar-content hover:text-[#f18c08] ${pathname === "/dashboard/products" ? 'text-[#f18c08]' : 'text-[#14446c]'
                                }`}
                            title={isMinimized ? "Produits" : ""}>
                            <TbClipboardList className={`${isMinimized ? 'w-9 h-9 minimized-icon': 'w-5 h-5'} link-icon`} />
                            {!isMinimized && "Produits"}
                        </Link>
                    </li>
                </div>
                <div className='sidebar-links'>
                    <li>
                        <Link
                            href="/dashboard/invoices"
                            className={`flex text-[#14446c]  text-lg side-bar-content hover:text-[#f18c08] ${pathname === "/dashboard/invoices" ? 'text-[#f18c08]' : 'text-[#14446c]'
                                }`}
                            title={isMinimized ? "Commandes" : ""}>
                            <MdReceiptLong className={`${isMinimized ? 'w-9 h-9 minimized-icon': 'w-5 h-5'} link-icon`} />
                            {!isMinimized && "Commandes"}
                        </Link>
                    </li>
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
                    <LogOut /> 
                    {!isMinimized && "Déconnexion"}
                </button>
            </div>
        </aside>
    );
}