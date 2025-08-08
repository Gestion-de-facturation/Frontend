import axios from "axios";
import toast from "react-hot-toast";
import { useLoading } from "@/store/useLoadingStore";

type DeleteParams = {
  deleteId: string | null;
  mutate: () => void;
  setShowConfirm: (val: boolean) => void;
  setDeleteId: (val: string | null) => void;
};

export const handleDeleteOrder = async ({
  deleteId,
  mutate,
  setShowConfirm,
  setDeleteId,
}: DeleteParams) => {
  if (!deleteId) return;

  const { show, hide } = useLoading.getState();

  try {
    show(); 
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${deleteId}`);
    toast.success("Commande supprimée");
    mutate();
  } catch (err) {
    toast.error("Erreur lors de la suppression");
  } finally {
    hide();
    setShowConfirm(false);
    setDeleteId(null);
  }
};
