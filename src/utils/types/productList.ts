export type Produit = {
    id: string;
    nom: string;
    prixUnitaire: number;
    fournisseur: string;
    categorie: string;
}

export type ProduitCommande = {
    idProduit: string;
    nom: string;
    quantite: number;
    prixUnitaire: number;
}