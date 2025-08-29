'use client'

import { useState } from "react";
import { handleSubmitOrder } from "@/utils/handlers/handleSubmitOrder";
import OrderForm from "./OrderForm";

export default function CreateOrderForm() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        await handleSubmitOrder({
            ...data,
            setLoading
        });
    };

    return (
        <div>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#ffffff71] bg-opacity-30 z-50">
                    <div className="w-16 h-16 border-4 border-[#f18c08] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <OrderForm
                onSubmit={handleSubmit}
                mode="create"
            />
        </div>
    );
}
