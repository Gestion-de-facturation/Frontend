import { Produit } from "./create";
import { ConfirmModalState } from "./ConfirmModalState";

export type BaseOrderParams = {
  produits: Produit[];
  adresseLivraison: string;
  adresseFacturation: string;
  fraisDeLivraison: string;
  setProduits: (p: Produit[]) => void;
  setSuggestions: (s: Record<number, any[]>) => void;
  resetChampsAdresse: () => void;
  setConfirmModal: (modal: ConfirmModalState) => void;
};
