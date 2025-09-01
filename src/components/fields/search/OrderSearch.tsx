import { useState } from "react";
import { FaSearch } from "react-icons/fa";

type OrderSearchProps = {
    globalFilter: string;
    setGlobalFilter: (val: string) => void;
    setDateRange: (range: { start: string; end: string }) => void;
}

export const OrderSearch = ({ globalFilter, setGlobalFilter, setDateRange }: OrderSearchProps) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleDateChange = (type: "start" | "end", value: string) => {
        if (type === "start") setStartDate(value);
        else setEndDate(value);

        setDateRange({
            start: type === "start" ? value : startDate,
            end: type === "end" ? value : endDate,
        });
    };

    return (
        <div className='flex gap-2'>
            <div className='flex gap-4 border border border-gray-300 h-8 w-70 rounded product-search-input mts'>
                <FaSearch size={20} className='order-search-icon' />
                <input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Rechercher une commande..."
                    className=' h-8 w-80 rounded global-search-input'
                />
            </div>
            <div className="flex items-center border border-gray-300 h-8 rounded bg-white shadow-sm mts date-search px-2">
                <label className="font-semibold">Durée: </label>
                <input
                    type="date"
                    className="h-8"
                    value={startDate}
                    onChange={(e) => handleDateChange("start", e.target.value)}
                />
                <span className="font-semibold">→</span>
                <input
                    type="date"
                    className="h-8"
                    value={endDate}
                    onChange={(e) => handleDateChange("end", e.target.value)}
                />
            </div>
        </div>
    )
}