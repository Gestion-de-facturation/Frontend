'use client'

import OrderForm from "@/components/orders/OrderForm";
import UpdateOrderForm from "@/components/orders/UpdateOrderForm";

export default function Invoices() {
    return(
        <div>
            <OrderForm />
            <UpdateOrderForm />
        </div>
    )
}