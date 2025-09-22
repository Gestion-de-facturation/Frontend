import '@/app/responsive.css';
import { formatPrice } from '@/utils/functions/formatPrice';

type Props = {
    totalProduits: number;
    total: number;
    fraisDeLivraison: string;
}

export const OrderSummary = (
    {
        totalProduits,
        total,
        fraisDeLivraison
    } : Props
) => {
    return (
        <div className='border border-[#cccccc] shadow-sm rounded order-sum-container'>
            <h2 className='text-xl font-bold'>Récapitulatif</h2>
            {/** Sous-total */}
            <div className="flex mb-4 form-content-mt gap-2 w-80 h-10 mts">
                <label className="w-64 font-medium mts"> Sous-total:  </label>
                <p className="w-64 h-8  p-2 rounded  mts ">{formatPrice(totalProduits)} Ar</p>
            </div>

            {/* Frais de livraison */}
            <div className="flex mb-4 form-content-mt gap-2 w-80 h-10 mts">
                <label className="w-64 font-medium">Frais de livraison:  </label>
                <p className="w-64 h-8  p-2 rounded font-semi-bold">{formatPrice(fraisDeLivraison) || '0'} Ar</p>
            </div>

            {/**Total */}
            <div className="flex justify-between border-t-2 border-[#cccccc] font-semibold text-lg total-container">
                <label>Total</label>
                <p>{formatPrice(total)} Ar</p>
            </div>
        </div>
    );
}