'use client'

import UpdateOrderForm from "@/components/orders/UpdateOrderForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UpdateOrderParams } from "@/utils/types/UpdateOrderParams";

export default function UpdateInvoicePage() {
    const searchParams = useSearchParams();
    const commandeId = searchParams.get('id');
    console.log(`commandeId: ${commandeId}`);

    return (
        <UpdateOrderForm commandeId={commandeId}/>
    )
}