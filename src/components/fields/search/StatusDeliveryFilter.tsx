import '@/styles/order.css';
import '@/styles/filter.css';

type Props = {
    onChange: (value: string) => void
}

export const StatusDeliveryFilter = ({onChange}: Props) => {
    return (
        <div className="border border-[#cccccc] h-8 mts rounded bg-white status-search">
            <label htmlFor="delivery-status" className='font-semibold'>livraison: </label>
            <select 
            name="delivery-status" 
            id="delivery-status"
            onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Tous</option>
                <option value="en_cours">en cours</option>
                <option value="livré">livré</option>
                <option value="reporté">reporté</option>
                <option value="annulé">annulé</option>
            </select>
        </div>
    );
}