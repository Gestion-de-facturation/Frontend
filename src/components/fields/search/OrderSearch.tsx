import { FaSearch } from "react-icons/fa";

type OrderSearchProps = {
    globalFilter: string;
    setGlobalFilter: (val: string) => void;
}

export const OrderSearch = ({globalFilter, setGlobalFilter} : OrderSearchProps) => {
    return (
        <div className='flex gap-2'>
            <div className='flex gap-4 border border border-gray-300 h-8 w-80 rounded product-search-input mts'>
                <FaSearch size={20} className='order-search-icon'/>
                <input 
                    type="text" 
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Rechercher une commande..."
                    className=' h-8 w-80 rounded'
                />
            </div>
            <div className=" border border border-[##ffffff] h-8 rounded bg-[#ffffff] shadow-sm mts date-search">
                <label className='font-semibold'>Date: </label>
                <input 
                type="date"
                className='h-8'
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>
        </div>
    )
}