import axios from "axios";

interface UpdateProductPayload {
  nom: string;
  prixUnitaire: number;
  idCategorie?: string;
  idFournisseur?: string;
}

export async function updateProduct(productId: string, payload: UpdateProductPayload): Promise<void> {
    try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/product/${productId}`, payload);
    } catch (err) {
        console.error("Erreur lors de la mise à jour du produit: ", err);
        throw err;
    }
}