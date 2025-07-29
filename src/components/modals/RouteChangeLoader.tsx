"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteChangeLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000); 

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed h-1 w-32 bg-[#f18c08] animate-pulse z-50" />
  );
}
