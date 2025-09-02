'use client'

import InvoicesList from "@/components/tables/InvoicesList";
import PaymentMethodList from "@/components/payment method/PaymentMethodList";

export default function Invoices() {
    return(
        <div>
            <InvoicesList />
            <PaymentMethodList />
        </div>
    )
}