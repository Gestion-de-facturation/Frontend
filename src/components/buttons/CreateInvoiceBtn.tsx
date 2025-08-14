import { IoMdAdd } from "react-icons/io";
import '@/styles/button.css';

type Props = {
    minimized: boolean;
}

export default function CreateInvoiceBtn ({minimized} : Props) {
    return (
        <button 
        className={`flex bg-[#14446c] item-center font-semibold h-10 ${
                minimized ? `minimized-width justify-center` : 'justify-start gap-2'
            } rounded create-inv-btn-container cursor-pointer hover:bg-[#14446ccb]`}
        title={minimized ? 'Ajouter une commande' : ''}
        >
            <IoMdAdd className={`${minimized ? 'w-6 h-6 minimized-btn-add' : 'w-4 h-4'} create-inv-btn-icon`}/>
            {!minimized && <p className='create-inv-btn-title'>Nouvelle commande</p>}
        </button>
    )
}