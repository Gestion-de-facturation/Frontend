import axios from "axios";
import { Produit } from "../types/create";
import toast from 'react-hot-toast';

type LoadOrderResult = {
    produits: Produit[];
    adresseLivraison: string;
    adresseFacturation: string;
    fraisDeLivrason: string;
    statutLivraison: string;
    statutPaiement: string;
    orderType: string;
    echeance: number;
    delai: number;
    date: string;
};

export const loadOrderById = async (idCommande: string):Promise<LoadOrderResult | null> => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${API_URL}/orders/${idCommande}`);

        const order = res.data;

        return {
            produits: order.commandeProduits.map((p: any) => ({
                nom: p.produit.nom,
                prixUnitaire: p.produit.prixUnitaire.toString(),
                quantite: p.quantite.toString(),
            })),
            adresseLivraison: order.adresse_livraison,
            adresseFacturation: order.adresse_facturation,
            statutLivraison: order.statut_livraison,
            statutPaiement: order.statut_paiement,
            orderType: order.order_type,
            echeance: order.echeance,
            delai: order.delai,
            fraisDeLivrason: order.frais_de_livraison.toString(),
            date: order.date,
        };
    } catch (error) {
        toast.error("La commande n'existe pas");
        return null;
    }
};