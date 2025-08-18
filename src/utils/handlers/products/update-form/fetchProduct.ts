import axios from "axios";
import { Produit } from "@/utils/types/products/Produit";

export async function fetchProduct(productId: string) : Promise<Produit> {
    try {
        const res = await axios.get<Produit>(`${process.env.NEXT_PUBLIC_API_URL}/products/product/${productId}`);
        return res.data;
    } catch (err) {
        console.error("Erreur lors de la récupération du produit: ", err);
        throw err;
    }
}