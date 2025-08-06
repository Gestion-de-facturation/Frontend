import { validateProductBeforeAdd } from "@/utils/products/validateProductBeforeAdd";
import { Produit } from '@/utils/types/create';

export function addProductFn(
    produits: Produit[],
    setProduits: (produits: Produit[]) => void
): void {
    const isValid = validateProductBeforeAdd(produits);
    if (!isValid) return ;

    setProduits([...produits, { nom: "", prixUnitaire: "", quantite: "" }]);
}