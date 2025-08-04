import axios from "axios";
import toast from "react-hot-toast";

type DeleteParams = {
    deleteId: string | null;
    mutate: () => void;
    setShowConfirm: (val: boolean) => void;
    setDeleteId: (val: string| null) => void;
}

export const handleDeleteOrder = async({deleteId, mutate, setShowConfirm, setDeleteId} : DeleteParams) => {
    if (!deleteId) return ;
    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${deleteId}`);
        toast.success('Commande supprimée');
        mutate();
    } catch (err) {
        toast.error('Erreur lors de la suppression');
    } finally {
        setShowConfirm(false);
        setDeleteId(null);
    }
}