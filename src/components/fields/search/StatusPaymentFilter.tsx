import '@/styles/order.css';
import '@/styles/filter.css';

type Props = {
    onChange: (value: string) => void
}

export const StatusPaymentFilter = ( {onChange} : Props ) => {
    return (
        <div className="border border-[#ffffff] h-8 mts rounded bg-[#ffffff] shadow-sm status-search">
            <label htmlFor="payment-status" className='font-semibold'>paiement: </label>
            <select 
            name="payment-status" 
            id="payment-status"
            onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Tous</option>
                <option value="en_attente">en attente</option>
                <option value="validé">validé</option>
                <option value="remboursé">remboursé</option>
                <option value="annulé">annulé</option>
            </select>
        </div>
    )
}