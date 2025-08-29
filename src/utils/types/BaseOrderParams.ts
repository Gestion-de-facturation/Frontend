import { Produit } from "./create";
import { ConfirmModalState } from "./ConfirmModalState";
import { ModePaiementPayload } from "../handlers/order-form/buildModePaiementPayload";

export type BaseOrderParams = {
  produits: Produit[];
  adresseLivraison: string;
  adresseFacturation: string;
  fraisDeLivraison: string;
  statutLivraison: string;
  statutPaiement: string;
  orderType: string;
  echeance: number;
  modePaiement?: ModePaiementPayload | null;
  setProduits: (p: Produit[]) => void;
  setSuggestions: (s: Record<number, any[]>) => void;
  resetChampsAdresse: () => void;
  setConfirmModal: (modal: ConfirmModalState) => void;
};
