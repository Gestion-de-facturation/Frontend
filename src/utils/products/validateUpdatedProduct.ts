import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const detectUpdatedProduct = async (produits: any[]) => {
    for (const produit of produits) {
        try {
            const res = await axios.get(`${API_URL}/products/product?name=${encodeURIComponent(produit.nom)}`);
            const existant = res.data.find((item: any) => item.nom === produit.nom);

            if (existant) {
                const prixModifie = parseFloat(produit.prixUnitaire) !== existant.prixUnitaire;
                const nomModifie = produit.nom !== existant.nom;

                if (prixModifie || nomModifie) {
                    return {
                        produit,
                        existant,
                        modifNom: nomModifie,
                        modifPrix: prixModifie,
                    };
                }
            }    
        }  catch (error: any) {
            if (error.response?.status === 404) {
            // Produit introuvable → pas une erreur bloquante
                continue;
            }
            // Vraie erreur serveur → à traiter
            throw error;
        }
    }
    return null;
}
