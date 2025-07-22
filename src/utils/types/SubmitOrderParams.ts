import { Produit } from "./create";
import { ConfirmModalState } from "./ConfirmModalState";

export type SubmitOrderParams = {
    produits: Produit[];
    adresseLivraison: string;
    adresseFacturation: string;
    fraisDeLivraison: string;

    setProduits: (produits: Produit[]) => void;
    setSuggestions: (s: Record<number, any[]>) => void;
    resetChampsAdresse: () => void;
    setConfirmModal: (modal: ConfirmModalState) => void;
}