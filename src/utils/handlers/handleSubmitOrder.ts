import axios from "axios";
import toast from "react-hot-toast";
import { detectUpdatedProduct } from "../products/validateUpdatedProduct";
import { ConfirmModalState } from "../types/ConfirmModalState";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const handleSubmitOrder = async ({
  produits,
  adresseLivraison,
  adresseFacturation,
  fraisDeLivraison,
  setProduits,
  setSuggestions,
  resetChampsAdresse,
  setConfirmModal,
  skipConfirmation = false,
}: {
  produits: any[];
  adresseLivraison: string;
  adresseFacturation: string;
  fraisDeLivraison: string;
  setProduits: (p: any[]) => void;
  setSuggestions: (s: any) => void;
  resetChampsAdresse: () => void;
  setConfirmModal: (modal: ConfirmModalState) => void;
  skipConfirmation?: boolean;
}) => {
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
      const modification = await detectUpdatedProduct(produits);

      if (modification) {
        const { produit, modifNom, modifPrix } = modification;
        const message = `Vous avez modifié le ${modifNom ? "nom" : ""}${
          modifNom && modifPrix ? " et le " : ""
        }${modifPrix ? "prix unitaire" : ""} du produit "${produit.nom}". Confirmez-vous ces changements ?`;

        return setConfirmModal({
          open: true,
          message,
          onConfirm: async () => {
            setConfirmModal({ open: false, message: "", onConfirm: () => {}, onCancel: () => {} });
            await handleSubmitOrder({
              produits,
              adresseLivraison,
              adresseFacturation,
              fraisDeLivraison,
              setProduits,
              setSuggestions,
              resetChampsAdresse,
              setConfirmModal,
              skipConfirmation: true,
            });
          },
          onCancel: () => {
            setConfirmModal({ open: false, message: "", onConfirm: () => {}, onCancel: () => {} });
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
              idFournisseur: "SUP20250723083813", // à adapter dynamiquement
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
      frais_de_livraison: Number(fraisDeLivraison || 0),
      produitsExistants,
      produitsNouveaux,
    };

    const res = await axios.post(`${API_URL}/orders/order_and_products`, commande);
    toast.success(`Commande créée avec succès (id: ${res.data.idCommande})`);

    setProduits([{ nom: "", prixUnitaire: "", quantite: "", fromSuggestion: false }]);
    setSuggestions({});
    resetChampsAdresse();
  } catch (error) {
    console.error("Erreur lors de la commande :", error);
    toast.error("Erreur lors de la commande. Veuillez réessayer.");
  }
};
