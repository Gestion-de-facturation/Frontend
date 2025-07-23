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
    // ✅ 1. Validation des produits
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

    // ✅ 2. Vérifier s’il faut une confirmation
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

    // ✅ 4. Créer la commande
    const order = {
      adresse_livraison: adresseLivraison,
      adresse_facturation: adresseFacturation,
      frais_de_livraison: Number(fraisDeLivraison || 0),
      date: new Date().toISOString().split("T")[0],
      produits: produitsEnBase
        .filter((p): p is NonNullable<typeof p> => p !== null && p.id)
        .map((p) => ({
          idProduit: p.id,
          quantite: parseInt(p.quantite),
        })),
    };

    console.log("Commande à envoyer: ", order)

    const res = await axios.post(`${API_URL}/orders/order`, order);
    toast.success(`Commande n°${res.data.orderId} passée avec succès.`);

    // ✅ 5. Nettoyage du formulaire
    setProduits([{ nom: "", prixUnitaire: "", quantite: "", fromSuggestion: false }]);
    setSuggestions({});
    resetChampsAdresse();
  } catch (error) {
    console.error("Erreur lors de la commande :", error);
    toast.error("Erreur lors de la commande. Veuillez réessayer.");
  }
};
