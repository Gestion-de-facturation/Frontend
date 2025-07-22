import { Produit } from "../types/create";
import { toast } from "react-hot-toast";

export function validateProductBeforeAdd(produits: Produit[]): boolean {
  const lastProduct = produits[produits.length - 1];

  if (!lastProduct) {
    toast.error("Produit invalide.");
    return false;
  }

  const nom = lastProduct.nom?.trim();
  const prix = parseFloat(lastProduct.prixUnitaire);
  const quantite = parseInt(lastProduct.quantite);

  const isValid =
    nom !== "" &&
    !isNaN(prix) &&
    prix > 0 &&
    !isNaN(quantite) &&
    quantite > 0;

  if (!isValid) {
    toast.error("Veuillez remplir correctement le dernier produit.");
    return false;
  }

  const existeDeja = produits.slice(0, -1).some(
    (p) => p.nom.trim().toLowerCase() === nom.toLowerCase()
  );

  if (existeDeja) {
    toast.error("Ce produit a déjà été ajouté.");
    return false;
  }

  return true;
}
