'use client'

import CreateOrderForm from "@/components/orders/CreateOrderForm";
import UpdateOrderForm from "@/components/orders/UpdateOrderForm";

export default function Invoices() {
    return(
        <div>
            <CreateOrderForm />
            <UpdateOrderForm />
        </div>
    )
}