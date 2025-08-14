import { IoMdAdd } from "react-icons/io";
import styles from './button-create-order.module.css';

type Props = {
    minimized: boolean;
}

export default function CreateInvoiceBtn ({minimized} : Props) {
    return (
        <button 
        className={`flex bg-[#14446c] item-center font-semibold h-10 ${
                minimized ? `${styles.minimizedWidth} justify-center` : 'justify-start gap-2'
            } rounded ${styles.createInvBtnContainer} cursor-pointer hover:bg-[#14446ccb]`}
        title={minimized ? 'Ajouter une commande' : ''}
        >
            <IoMdAdd className={`${minimized ? 'w-6 h-6 minimized-btn-add' : 'w-4 h-4'} ${styles.createInvBtnIcon}`}/>
            {!minimized && <p className={styles.createInvBtnTitle}>Nouvelle commande</p>}
        </button>
    )
}