'use client';

import { useRouter } from 'next/navigation';
import '@/styles/button.css';

type Props = {
    target: string;
};

export const ViewAll = ({target} : Props) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(target)
    }

    return (
        <button 
        onClick={handleClick}
        className="border border-[#cccccc] rounded font-semibold cursor-pointer hover:bg-white view-all-btn">
            Voir tout
        </button>
    )
}