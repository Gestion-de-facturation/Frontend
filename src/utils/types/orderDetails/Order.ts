import { ProduitCommande } from "./ProduitCommande";

export type Order = {
    id: string;
    date: string;
    adresse_livraison: string;
    adresse_facturation: string;
    frais_de_livraison: number;
    statut_livraison: string;
    statut_paiement: string;
    order_type: string;
    total: number;
    commandeProduits: ProduitCommande[];
};