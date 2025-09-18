import toast from "react-hot-toast";
import { loadOrderById } from "@/utils/hooks/useLoadOrder";
import { Produit } from "@/utils/types/create";

type SearchOrderResult = {
  produits: Produit[];
  adresseLivraison: string;
  adresseFacturation: string;
  statutLivraison: string;
  statutPaiement: string;
  orderType: string;
  echeance: number;
  delai: number;
  fraisDeLivrason: string;
  date: string;
} | null;

export const handleSearchOrderFn = async (
  idCommande: string,
  reference: string,
  setProduits: (value: Produit[]) => void,
  setAdresseLivraison: (value: string) => void,
  setAdresseFacturation: (value: string) => void,
  setStatutLivraison: (value: string) => void,
  setStatutPaiement: (value: string) => void,
  setOrderType: (value: string) => void,
  setEcheance: (value: number) => void,
  setDelai: (value: number) => void,
  setFraisDeLivraison: (value: string) => void,
  setDate: (value: string) => void
) => {
  if (!idCommande.trim()) return;

  const data: SearchOrderResult = await loadOrderById(idCommande);
  if (data) {
    setProduits(data.produits);
    setAdresseLivraison(data.adresseLivraison);
    setAdresseFacturation(data.adresseFacturation);
    setStatutLivraison(data.statutLivraison);
    setStatutPaiement(data.statutPaiement);
    setOrderType(data.orderType);
    setEcheance(data.echeance);
    setDelai(data.delai);
    setFraisDeLivraison(data.fraisDeLivrason);
    setDate(data.date?.split("T")[0] || "");
  } else {
    toast.error("Commande introuvable.");
  }
};
