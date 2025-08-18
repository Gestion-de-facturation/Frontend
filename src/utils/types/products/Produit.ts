export interface Produit {
  id: string;
  nom: string;
  prixUnitaire: number;
  idFournisseur: string;
  idCategorie: string;
  categorie: {
    id: string;
    nom: string;
  };
  fournisseur: {
    id: string;
    nom: string;
  };
}
