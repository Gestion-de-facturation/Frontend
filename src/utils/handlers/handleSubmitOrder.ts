import axios from "axios";
import toast from "react-hot-toast";
import { detectUpdatedProduct } from "../products/validateUpdatedProduct";
import { ConfirmModalState } from "../types/ConfirmModalState";
import { ModePaiementPayload } from "./order-form/buildModePaiementPayload";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const handleSubmitOrder = async ({
  produits,
  adresseLivraison,
  adresseFacturation,
  statutLivraison,
  statutPaiement,
  orderType,
  echeance,
  fraisDeLivraison,
  modePaiement,
  setProduits,
  setSuggestions,
  resetChampsAdresse,
  setConfirmModal,
  setLoading,
  skipConfirmation = false,
}: {
  produits: any[];
  adresseLivraison: string;
  adresseFacturation: string;
  statutLivraison: string;
  statutPaiement: string;
  orderType: string;
  echeance: number;
  fraisDeLivraison: string;
  modePaiement: ModePaiementPayload | null;
  setProduits: (p: any[]) => void;
  setSuggestions: (s: any) => void;
  resetChampsAdresse: () => void;
  setConfirmModal: (modal: ConfirmModalState) => void;
  setLoading: (value: boolean) => void;
  skipConfirmation?: boolean;
}) => {
  if (!adresseLivraison || !adresseFacturation) {
    toast.error("Veuillez remplir les adresses de la commande.");
    return;
  }

  const selectedMode = modePaiement || {
    nom: "",
    description: { contenu: "" },
    isActive: true,
  };

  if (!selectedMode.nom || selectedMode.nom.trim() === "") {
    toast.error("Veuillez choisir un mode de paiement.");
    return;
  }

  try {
    const nomsProduits = new Set<string>();

    for (const produit of produits) {
      const nom = produit.nom?.trim().toLowerCase();
      const prix = parseFloat(produit.prixUnitaire);
      const quantite = parseInt(produit.quantite);

      if (!nom || isNaN(prix) || prix <= 0 || isNaN(quantite) || quantite <= 0) {
        toast.error(`Produit invalide: "${produit.nom}"`);
        return;
      }

      if (nomsProduits.has(nom)) {
        toast.error(`Vous avez déjà "${produit.nom}" dans la liste.`);
        return;
      }

      nomsProduits.add(nom);
    }

    if (!skipConfirmation) {
      const modifications = await detectUpdatedProduct(produits);

      if (modifications) {
        const message = `Vous avez modifié :\n${modifications.map(({ produit, modifNom, modifPrix }) => {
          const parts = [];
          if (modifNom) parts.push("nom");
          if (modifPrix) parts.push("prix unitaire");
          return `• le ${parts.join(" et ")} du produit "${produit.nom}"`;
        })
          .join("\n")}\nConfirmez-vous ces changements ?`;

        return setConfirmModal({
          open: true,
          message,
          onConfirm: async () => {
            setConfirmModal({ open: false, message: "", onConfirm: () => { }, onCancel: () => { } });
            if (setLoading) setLoading(true);
            try {
              await handleSubmitOrder({
                produits,
                adresseLivraison,
                adresseFacturation,
                statutLivraison,
                statutPaiement,
                orderType,
                echeance,
                fraisDeLivraison,
                modePaiement,
                setProduits,
                setSuggestions,
                resetChampsAdresse,
                setConfirmModal,
                setLoading,
                skipConfirmation: true,
              });
            } finally {
              if (setLoading) setLoading(false);
            }

          },
          onCancel: () => {
            setConfirmModal({ open: false, message: "", onConfirm: () => { }, onCancel: () => { } });
            toast("Modification annulée");
          },
        });
      }
    }

    const produitsExistants: { idProduit: string; quantite: number; prix_unitaire?: number }[] = [];
    const produitsNouveaux: {
      nom: string;
      prix_unitaire: number;
      idFournisseur: string;
      idCategorie: string;
      quantite: number;
    }[] = [];

    for (const p of produits) {
      try {
        const res = await axios.get(`${API_URL}/products/product?name=${encodeURIComponent(p.nom)}`);
        const existant = Array.isArray(res.data) && res.data.find((item: any) => item.nom === p.nom);

        if (existant) {
          const prixSaisi = parseFloat(p.prixUnitaire);
          const prixBase = existant.prixUnitaire;

          if (prixSaisi !== prixBase) {
            await axios.put(`${API_URL}/products/product/${existant.id}`, {
              nom: p.nom,
              prixUnitaire: prixSaisi,
              idFournisseur: "SUP20250723083813",
              idCategorie: "CAT20250723083722",
            });
          }

          produitsExistants.push({
            idProduit: existant.id,
            quantite: parseInt(p.quantite),
            prix_unitaire: prixSaisi,
          });
        } else {
          produitsNouveaux.push({
            nom: p.nom,
            prix_unitaire: parseFloat(p.prixUnitaire),
            idFournisseur: "SUP20250723083813",
            idCategorie: "CAT20250723083722",
            quantite: parseInt(p.quantite),
          });
        }
      } catch (err) {
        console.error(`Erreur produit "${p.nom}"`, err);
        toast.error(`Erreur sur le produit "${p.nom}"`);
        return;
      }
    }

    const commande = {
      adresse_livraison: adresseLivraison,
      adresse_facturation: adresseFacturation,
      statut_livraison: statutLivraison,
      statut_paiement: statutPaiement,
      order_type: orderType,
      echeance: echeance,
      frais_de_livraison: Number(fraisDeLivraison || 0),
      produitsExistants,
      produitsNouveaux,

      modePaiement: {
        nom: selectedMode.nom,
        description: { contenu: selectedMode.description?.contenu || "" },
        isActive: Boolean(selectedMode.isActive),
      },
    };

    const res = await axios.post(`${API_URL}/orders/order_and_products`, commande);
    toast.success(`Commande créée avec succès réf: ${res.data.reference}`);

    setProduits([{ nom: "", prixUnitaire: "", quantite: "", fromSuggestion: false }]);
    setSuggestions({});
    resetChampsAdresse();
  } catch (error) {
    console.error("Erreur lors de la commande :", error);
    toast.error("Erreur lors de la commande. Veuillez réessayer.");
  }
};
