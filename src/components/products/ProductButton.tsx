import { FiRotateCw } from 'react-icons/fi';
import { FaRegSave } from "react-icons/fa";

export default function ProductButton () {
    return (
        <div className="flex justify-between mts product-modif-container">
            <button className='flex gap-2 font-semibold text-lg border border-[#cccccc] rounded cursor-pointer hover:bg-[#ffffff] product-update-btn '>
                <FiRotateCw size={22}/>
                <span>Annuler</span>
            </button>
            <button className='flex gap-2 font-semibold text-lg text-white bg-[#14446c] rounded cursor-pointer hover:bg-[#f18c08] product-update-btn '>
                <FaRegSave size={22}/>
                <span>Enregistrer</span>
            </button>
        </div>
    );
}