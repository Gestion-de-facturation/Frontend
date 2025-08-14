import { FaSearch } from "react-icons/fa";
import '@/styles/form.css';
import '@/app/responsive.css';

type Props = {
    idCommande: string;
    setIdCommande: (val: string) => void;
    handleSearchOrder: () => void;
    date: string;
    setDate: (val: string) => void;
}

export const OrderFormDetails = ({
    idCommande,
    setIdCommande,
    handleSearchOrder,
    date,
    setDate
}:Props) => {
    return (
        <div className='mts border border-[#cccccc] rounded-md shadow-sm order-update-details-container'>
            <h2 className='text-xl font-bold'>Détails</h2>
            <div className="flex justify-between items-center gap-4 mts">
                <div className='flex gap-2 w-1/2'>
                    <div className="flex flex-col">
                        <label className="block font-medium mb-1">Référence de la commande</label>
                        <input
                            type="text"
                            className="border border-gray-300 h-8 rounded mts form-input-padding-left"
                            value={idCommande}
                            onChange={(e) => setIdCommande(e.target.value)}
                            placeholder="Ex: FA20250720120000"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSearchOrder}
                        className="rounded h-8 cursor-pointer search-order-id"
                        title='Rechercher'
                    >
                        <FaSearch className='text-lg hover:text-[#f18c08]' />
                    </button>
                </div>

                <div className="flex flex-col w-1/2">
                    <label className="block font-medium mb-1">Date de la commande</label>
                    <input
                        type="date"
                        className="border border-gray-300 h-8 rounded mts form-input-padding-left"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}