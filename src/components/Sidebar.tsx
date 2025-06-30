'use client';

import { useRouter } from 'next/navigation';
import '@/styles/sidebar.css'


export default function Sidebar() {
    const router = useRouter();

    return (
        <aside className="w-48 bg-gray-100 text-white h-screen p-4 border-r-1 border-[#14446c]">
            <div className='border-b-1 border-[#14446c] h-12'>
                <h2 className="text-3xl font-semibold place-self-center logo">
                    <strong className='text-[#14446c]'>Best</strong>
                    <strong className='text-[#f18c08]'>place</strong>
                </h2>
            </div>
            <ul className="space-y-2 place-self-center">
                <div className='sidebar-links'>
                    <li><a href="/dashboard" className="text-[#14446c] text-xl">Commander</a></li>
                </div>
                <div className='sidebar-links'>
                    <li><a href="/orders" className="text-[#14446c]  text-xl">Commandes</a></li>
                </div>
                <div className='sidebar-links'>
                    <li><a href="/customers" className="text-[#14446c]  text-xl">Clients</a></li>
                </div>
            </ul>
            <button
            className="bg-red-500 text-white p-2 cursor-pointer rounded-md h-10 w-36 disconnect-btn"
            onClick={() => {
            localStorage.removeItem('isLoggedIn');
            router.push('/login');
            }}
        >
            Déconnexion
            </button>
        </aside>
    )
}