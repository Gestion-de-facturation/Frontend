import { ProduitCommande } from "./ProduitCommande";

type ModePaiement = {
    id: string;
    nom: string;
    isActive: boolean;
    descirption?: {
        contenu: string;
    };
};

export type Paiement = {
    id: string;
    idCommande: string;
    idMode: string;
    descriptionChoisie?: string;
    mode:ModePaiement;
}

export type Order = {
    id: string;
    reference?: string;
    date: string;
    adresse_livraison: string;
    adresse_facturation: string;
    frais_de_livraison: number;
    statut_livraison: string;
    statut_paiement: string;
    order_type: string;
    echeance: number;
    total: number;
    commandeProduits: ProduitCommande[];
    paiements?: Paiement[];
};