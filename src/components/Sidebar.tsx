'use client';

import { useRouter } from 'next/navigation';
import '@/styles/sidebar.css'
import { LogOut } from 'lucide-react';
import { MdReceipt, MdReceiptLong, MdPerson  } from "react-icons/md";


export default function Sidebar() {
    const router = useRouter();

    return (
        <aside className="flex flex-col w-48 bg-gray-100 text-white h-screen p-4 border-r-1 border-[#CCCCCC] inset-shadow-sm inset-shadow-[#CCCCCC]">
            <div className='border-b-1 border-[#CCCCCC] h-16'>
                <h2 className="text-3xl font-semibold place-self-center logo">
                    <strong className='text-[#14446c]'>Best</strong>
                    <strong className='text-[#f18c08]'>place</strong>
                </h2>
            </div>
            <ul className="place-self-center">
                <div className='sidebar-links mt-link'>
                    <li><a href="/dashboard" className="flex text-[#14446c] text-lg side-bar-content hover:text-[#f18c08]"><MdReceipt className='w-5 h-5 link-icon'/>Commander</a></li>
                </div>
                <div className='sidebar-links'>
                    <li><a href="/orders" className=" flex text-[#14446c]  text-lg side-bar-content hover:text-[#f18c08]"><MdReceiptLong className='w-5 h-5 link-icon'/>Commandes</a></li>
                </div>
                <div className='sidebar-links'>
                    <li><a href="/customers" className="flex text-[#14446c]  text-lg side-bar-content hover:text-[#f18c08]"> <MdPerson className='w-5 h-5 link-icon'/> Clients</a></li>
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