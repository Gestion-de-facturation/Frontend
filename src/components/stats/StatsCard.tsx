import React from "react";
import '@/styles/stats.css';
import '@/styles/big-screen/stats.css'

type Props = {
    title: string;
    icon: React.ReactNode;
    content: string;
    percentage: string;
}

export default function StatsCard({title, icon, content, percentage}:Props) {
    return (
        <div className="border border-[#cccccc] w-[25%] 2xl:w-[20%] h-[20vh] 2xl:h-[10vh] shadow-sm rounded-md hover:shadow-md stats-container">
            <div className="flex justify-between">
                <p className="font-semibold">{title}</p>
                <div>{icon}</div>
            </div>
            <p className="text-xl font-bold stats-items">{content}</p>
            <p><span className="text-[#f18c08] stats-items">{percentage}</span> par rapport au mois dernier</p>
        </div>
    );
} 