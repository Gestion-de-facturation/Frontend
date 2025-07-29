"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

export function RouteChangeLoader() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lors d’un changement de route, active le loader
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000); // Delay fictif

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed h-1 w-32 bg-[#f18c08] animate-pulse z-50" />
  );
}
