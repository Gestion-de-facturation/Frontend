import '@/styles/order.css';
import '@/styles/filter.css';

type Props = {
    onChange : (value: string) => void
}

export const OrderTypeFilter = ({onChange} : Props) => {
    return (
        <div className="border border-[#cccccc] h-8 mts rounded status-search">
            <label htmlFor="order-type" className='font-semibold'>type: </label>
            <select 
            name="order-type" 
            id="order-type"
            onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Tous</option>
                <option value="facture">facture</option>
                <option value="devis">devis</option>
            </select>
        </div>        
    )
}