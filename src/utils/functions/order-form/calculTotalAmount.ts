import { Produit } from "@/utils/types/create";

export const calculTotalAmount = (produits: Produit[], fraisDeLivraison: string) => {
    const totalProduits = produits.reduce((sum, p) => {
    const prix = parseFloat(p.prixUnitaire || '0');
    const quantiteInt = parseInt(String(p.quantite || '0'));
        return sum + quantiteInt * prix;
    }, 0);
    const total = totalProduits + Number(fraisDeLivraison);
    return {total, totalProduits}
}