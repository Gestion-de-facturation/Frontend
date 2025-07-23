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
  setProduits,
  setSuggestions,
  resetChampsAdresse,
  setConfirmModal
}: UpdateOrderParams) => {
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

    if (modification) {
      const { produit, modifNom, modifPrix } = modification;
      const message = `Vous avez modifié le ${modifNom ? "nom" : ""}${modifNom && modifPrix ? " et le " : ""}${modifPrix ? "prix unitaire" : ""} du produit "${produit.nom}". Confirmez-vous ces changements ?`;

      return setConfirmModal({
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
            setProduits,
            setSuggestions,
            resetChampsAdresse,
            setConfirmModal,
          });
        },
        onCancel: () => {
          setConfirmModal({ open: false, message: '', onConfirm: () => {}, onCancel: () => {} });
          toast("Modification annulée.");
        }
      });
    }

    // ✅ 3. Créer ou mettre à jour les produits dans la base
    const produitsEnBase = await Promise.all(
      produits.map(async (p) => {
        try {
          const res = await axios.get(`${API_URL}/products/product?name=${encodeURIComponent(p.nom)}`);
          const existant = Array.isArray(res.data) && res.data.length > 0
           ? res.data.find((item: any) => item.nom === p.nom) : undefined;

          if (existant) {
            const prixModifie = parseFloat(p.prixUnitaire) !== existant.prixUnitaire;
            const nomModifie = p.nom !== existant.nom;

            if (prixModifie || nomModifie) {
              await axios.put(`${API_URL}/products/product/${existant.id}`, {
                nom: p.nom,
                prixUnitaire: parseFloat(p.prixUnitaire),
                idFournisseur: "SUP20250723083813", // ✅ à ajuster dynamiquement au besoin
                idCategorie: "CAT20250723083722",
              });
            }

            return { id: existant.id, ...p };
          }

          // ✅ Création du produit si non trouvé
          const creation = await axios.post(`${API_URL}/products/product`, {
            nom: p.nom,
            prixUnitaire: parseFloat(p.prixUnitaire),
            idFournisseur: "SUP20250723083813",
            idCategorie: "CAT20250723083722",
          });

          return { id: creation.data.id, ...p };
        } catch (error) {
          console.error(`Erreur produit "${p.nom}"`, error);
          toast.error(`Impossible d'enregistrer le produit "${p.nom}"`);
          return null;
        }
      })
    );

    const updatePayload = {
      adresse_livraison: adresseLivraison,
      adresse_facturation: adresseFacturation,
      frais_de_livraison: Number(fraisDeLivraison || 0),
      date,
      produits: produitsEnBase.filter((p): p is NonNullable<typeof p> => p !== undefined).map((p) => ({
        idProduit: p.id,
        quantite: parseInt(p.quantite),
      }))
    };

    const res = await axios.put(`${API_URL}/orders/order/${idCommande}`, updatePayload);

    toast.success(`Commande n°${idCommande} mise à jour avec succès !`);
    setProduits([{ nom: '', prixUnitaire: '', quantite: '', fromSuggestion: false }]);
    setSuggestions({});
    resetChampsAdresse();
  } catch (error) {
    toast.error("Erreur lors de la mise à jour de la commande. Veuillez réessayer.");
  }
};
