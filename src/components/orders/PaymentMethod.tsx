import '@/styles/form.css';
import '@/styles/order.css';

export default function PaymentMethod() {
    return (
        <div className="order-delivery-cost-container border border-[#cccccc] shadow-sm rounded-md">
            <h2 className="text-xl font-bold">Méthode de paiement</h2>
            <input
                type="text"
                placeholder='MVola'
                className="border p-2 rounded mts w-40 h-8 form-input-padding-left" />
        </div>
    )
}
