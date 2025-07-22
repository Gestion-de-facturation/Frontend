import axios from "axios";
import toast from 'react-hot-toast';
import { detectUpdatedProduct } from "../products/validateUpdatedProduct";
import { ConfirmModalState } from "../types/ConfirmModalState";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const handleSubmitOrder = async ({
    produits,
    adresseLivraison,
    adresseFacturation,
    fraisDeLivraison,
    setProduits,
    setSuggestions,
    resetChampsAdresse,
    setConfirmModal,
    skipConfirmation = false,
} : {
    produits: any[];
    adresseLivraison: string;
    adresseFacturation: string;
    fraisDeLivraison: string;
    setProduits: (p: any[]) => void;
    setSuggestions: (s: any) => void;
    resetChampsAdresse: () => void;
    setConfirmModal: (modal: ConfirmModalState) => void;
    skipConfirmation?: boolean;
}) => {
    try {
        //Vérification des doublons et champs
        const nomsProduits = new Set<string>();

        for(const produit of produits) {
            const nom = produit.nom?.trim().toLowerCase();
            const prix = parseFloat(produit.prixUnitaire);
            const quantite = parseInt(produit.quantite);

            if(!nom || isNaN(prix) || prix <= 0 || isNaN(quantite) || quantite <= 0) {
                toast.error(`Produit invalide: "${produit.nom}`);
                return;
            } 

            if (nomsProduits.has(nom)) {
                toast.error(`Vous avez déjà "${produit.nom}" dans la liste.`);
                return;
            }

            nomsProduits.add(nom);
        }

        //Vérification si confirmation requise
        if (!skipConfirmation) {
            const modification = await detectUpdatedProduct(produits);

            if (modification) {
                const { produit, modifNom, modifPrix  } = modification;
                const message = `Vous avez modifié le ${modifNom ? "nom" : ""}${modifNom && modifPrix ? " et le " : ""}${modifPrix ? "prix unitaire" : ""} du produit "${produit.nom}". Confirmez-vous ces changements ?`;

                return setConfirmModal({
                    open: true,
                    message,
                    onConfirm: async () => {
                        setConfirmModal({ open: false, message: '', onConfirm : () => {}, onCancel: () => {} });
                        await handleSubmitOrder({
                            produits,
                            adresseLivraison, 
                            adresseFacturation,
                            fraisDeLivraison,
                            setProduits,
                            setSuggestions,
                            resetChampsAdresse,
                            setConfirmModal,
                            skipConfirmation: true,
                        });
                    },
                    onCancel: () => {
                        setConfirmModal({ open: false, message: '', onConfirm: () => {}, onCancel: () => {} });
                        toast("Modification annulée");
                    },
                });
            }
        }

        //Si pas de validation requise
        const produitsEnBase = await Promise.all(
            produits.map(async (p) => {
                try {
                    const res = await axios.get(`${API_URL}/products/product?name=${encodeURIComponent(p.nom)}`);
                    const existant = res.data.find((item: any) => item .nom === p.nom);

                    if (existant) {
                        const prixModifie = parseFloat(p.prixUnitaire) !== existant.prixUnitaire;
                        const nomModifie = p.nom !== existant.nom;

                        if (prixModifie || nomModifie) {
                            await axios.put(`${API_URL}/products/product/${existant.id}`, {
                                nom: p.nom,
                                prixUnitaire: parseFloat(p.prixUnitaire),
                                idFournisseur: "SUP20250627-153508",
                                idCategorie: "CAT20250627-153441",
                            });
                        }

                        return { id: existant.id, ...p };
                    }

                    const creation = await axios.post(`${API_URL}/products/product`, {
                        nom: p.nom,
                        prixUnitaire: parseFloat(p.prixUnitaire),
                        idFournisseur: "SUP20250627-153508",
                        idCategorie: "CAT20250627-153441",
                    });

                    return { id: creation.data.id, ...p };
                } catch(error) {
                    toast.error(`Erreur produit "${p.nom}"`);
                }
            })
        );

        const order = {
            adresse_livraison : adresseLivraison,
            adresse_facturation : adresseFacturation,
            frais_de_livraison:  Number(fraisDeLivraison || 0),
            date: new Date().toISOString().split("T")[0],
            produits: produitsEnBase.filter((p): p is NonNullable<typeof p> => p !== undefined).map((p) => ({
                idProduit: p.id,
                quantite: parseInt(p.quantite),
            })),
        };

        const res = await axios.post(`${API_URL}/orders/order`, order);
        toast.success(`Commande n°${res.data.orderId} passéea avec succès.`);

        setProduits([{ nom: '', prixUnitaire: '', quantite: '', fromSuggestion: false }]);
        setSuggestions({});
        resetChampsAdresse();
    } catch (error) {
        toast.error("Erreur lors de la commande. Veuiilez réessayer.");
    }
};
