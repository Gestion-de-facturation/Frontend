import { IoMdAdd } from "react-icons/io";
import '@/styles/button.css'

export default function CreateInvoiceBtn () {
    return (
        <button className="flex bg-[#14446c] font-semibold h-10 gap-2 rounded create-inv-btn-container cursor-pointer hover:bg-[#14446ccb]">
            <IoMdAdd className="create-inv-btn-icon"/>
            <p className="create-inv-btn-title">Nouvelle commande</p>
        </button>
    )
}