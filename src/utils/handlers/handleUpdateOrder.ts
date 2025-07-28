import axios from "axios";
import toast from "react-hot-toast";
import { detectUpdatedProduct } from "../products/validateUpdatedProduct";
import { UpdateOrderParams } from "../types/UpdateOrderParams";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const handleUpdateOrder = async ({
  idCommande,
  date,
  produits,
  adresseLivraison,
  adresseFacturation,
  fraisDeLivraison,
  statutLivraison,
  statutPaiement,
  orderType,
  setProduits,
  setSuggestions,
  resetChampsAdresse,
  setConfirmModal,
  skipConfirmation = false,
}: UpdateOrderParams & { skipConfirmation?: boolean }) => {
  try {
    const nomsProduits = new Set<string>();
    for (const produit of produits) {
      const nom = produit.nom?.trim().toLowerCase();
      const prix = parseFloat(produit.prixUnitaire);
      const quantite = parseInt(produit.quantite);

      if (!nom || isNaN(prix) || prix <= 0 || isNaN(quantite) || quantite <= 0) {
        toast.error(`Produit invalide : "${produit.nom}"`);
        return;
      }

      if (nomsProduits.has(nom)) {
        toast.error(`Produit en double détecté : "${produit.nom}"`);
        return;
      }

      nomsProduits.add(nom);
    }

    const modification = await detectUpdatedProduct(produits);

    if (modification && !skipConfirmation) {
      const { produit, modifNom, modifPrix } = modification;
      const message = `Vous avez modifié le ${modifNom ? "nom" : ""}${modifNom && modifPrix ? " et le " : ""}${modifPrix ? "prix unitaire" : ""} du produit "${produit.nom}". Confirmez-vous ces changements ?`;

      setConfirmModal({
        open: true,
        message,
        onConfirm: async () => {
          setConfirmModal({ open: false, message: '', onConfirm: () => {}, onCancel: () => {} });
          await handleUpdateOrder({
            idCommande,
            date,
            produits,
            adresseLivraison,
            adresseFacturation,
            fraisDeLivraison,
            statutLivraison,
            statutPaiement,
            orderType,
            setProduits,
            setSuggestions,
            resetChampsAdresse,
            setConfirmModal,
            skipConfirmation: true,
          });

          console.log(`Bouton appuyé `)
        },
        onCancel: () => {
          setConfirmModal({ open: false, message: '', onConfirm: () => {}, onCancel: () => {} });
          toast("Modification annulée.");
        }
      });

      return;
    }

    // ✅ Obtenir produits existants ou créer les nouveaux
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
        const existant = Array.isArray(res.data) && res.data.length > 0
          ? res.data.find((item: any) => item.nom === p.nom)
          : undefined;

        if (existant) {
          const prixModifie = parseFloat(p.prixUnitaire) !== existant.prixUnitaire;
          const nomModifie = p.nom !== existant.nom;

          if (prixModifie || nomModifie) {
            await axios.put(`${API_URL}/products/product/${existant.id}`, {
              nom: p.nom,
              prixUnitaire: parseFloat(p.prixUnitaire),
              idFournisseur: "SUP20250723083813",
              idCategorie: "CAT20250723083722",
            });
          }

          produitsExistants.push({
              idProduit: existant.id,
              quantite: parseInt(p.quantite),
              prix_unitaire: parseFloat(p.prixUnitaire), // <-- Ajouté
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
      } catch (error) {
        console.error(`Erreur produit "${p.nom}"`, error);
        toast.error(`Impossible d'enregistrer le produit "${p.nom}"`);
        return;
      }
    }

    const payload = {
      adresse_livraison: adresseLivraison,
      adresse_facturation: adresseFacturation,
      statut_livraison: statutLivraison,
      statut_paiement: statutPaiement,
      order_type: orderType,
      frais_de_livraison: Number(fraisDeLivraison || 0),
      date,
      produitsExistants,
      produitsNouveaux,
    };

    await axios.put(`${API_URL}/orders/order_and_products/${idCommande}`, payload);

    toast.success(`Commande n°${idCommande} mise à jour avec succès !`);
    setProduits([{ nom: '', prixUnitaire: '', quantite: '', fromSuggestion: false }]);
    setSuggestions({});
    resetChampsAdresse();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    toast.error("Erreur lors de la mise à jour de la commande. Veuillez réessayer.");
  }
};
