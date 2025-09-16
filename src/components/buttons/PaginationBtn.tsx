import { Order } from "@/utils/types/orderList";
import { Table } from "@tanstack/react-table";
import { PsOrder } from "../prestashop/PsOrder";

type PaginationProps = {
    table: Table<Order> | Table<PsOrder>;
}

export const PaginationBtn = ({table} : PaginationProps) => {
    return (
        <div className="flex justify-between items-center mts">
            <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'    
            >
                Précédent
            </button>
            <span>
                Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
            </span>
            <button 
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'    
            >
                Suivant
            </button>
        </div>
    );
}