'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AppLoader() {
    const router = useRouter();
    const pathname = usePathname();
    const[loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="h-12 w-12 border-4 border-[#1444f6] border-t-transparent rounded-full animate-spin" />
        </div>
    );
}