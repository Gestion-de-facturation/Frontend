import '@/styles/form.css';
import '@/styles/order.css';
import { TbInvoice } from "react-icons/tb"

export default function UpdateOrderForm(){
    return (
        <div className="add-form-container max-w-3xl mx-auto p-6 border border-[#cccccc] rounded-md shadow-lg place-self-center mts">
            <h2 className="flex flex-row justify-between text-2xl font-bold  add-form-content">
                Modifier une commande <TbInvoice className='w-8 h-8 text-[#14446c]'/>
            </h2>
        </div>
    )
}

