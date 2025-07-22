import { Produit } from "../types/create";

export function removeProduct(index: number, produits: Produit[]): Produit[] {
  if (produits.length === 1) return [{ nom: "", prixUnitaire: "", quantite: "" }];
  const updated = [...produits];
  updated.splice(index, 1);
  return updated;
}
