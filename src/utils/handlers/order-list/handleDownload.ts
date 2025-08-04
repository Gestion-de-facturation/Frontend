import axios from "axios";

export const handleDownload = async (orderId: string) => {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);

        const produits = data.commandeProduits.map((item: any) => ({
            id: item.idProduit,
            nom: item.produit.nom,
            quantite: item.quantite,
            prixUnitaire: item.produit.prixUnitaire
        }));

        const factureBody = {
            id: data.id,
            date: data.date.substring(0, 10),
            adresseLivraison: data.adresse_livraison,
            adresseFacturation: data.adresse_facturation,
            fraisDeLivraison: data.frais_de_livraison,
            orderType: data.order_type.toUpperCase(),
            produits,
        };

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoice/create`, factureBody);
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/invoice/${orderId}/download`);
    } catch (err) {
        console.error("Erreur de téléchargement: ", err);
        
    };
}