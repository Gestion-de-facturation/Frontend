'use client'

import InvoicesList from "@/components/tables/InvoicesList";
import PaymentMethodList from "@/app/payment method/PaymentMethodList";

export default function Invoices() {
    return(
        <div>
            <InvoicesList />
            <PaymentMethodList />
        </div>
    )
}