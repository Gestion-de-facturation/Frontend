import '@/styles/order.css';
import '@/styles/filter.css';

type Props = {
    onChange: (value: string) => void
}

export const StatusPaymentFilter = ( {onChange} : Props ) => {
    return (
        <div className="border border-[#cccccc] h-8 mts rounded status-search">
            <label htmlFor="delivery-status" className='font-semibold'>paiement: </label>
            <select 
            name="delivery-status" 
            id="delivery-status"
            onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Tous</option>
                <option value="en_attente">en attente</option>
                <option value="validé">validé</option>
                <option value="annulé">annulé</option>
            </select>
        </div>
    )
}