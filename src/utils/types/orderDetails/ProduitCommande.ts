export type ProduitCommande = {
    idProduit: string;
    quantite: number;
    montant: number;
    produit: {
        nom: string;
        prixUnitaire: number;
    };
};