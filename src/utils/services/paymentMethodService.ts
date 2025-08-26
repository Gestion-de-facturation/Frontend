import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export async function fetchPaymentMethods() {
    try {
        const response = await axios.get(`${API_URL}/payments`, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Erreur récupération modes de paiement: ", error);
        throw error;
    }
}

export async function createPaymentMethod(nom: string, descriptions: { contenu: string }[], isActive = true) {
    try {
        const response = await axios.post(`${API_URL}/payments/payment`, {
            nom,
            descriptions,
            isActive,
        }, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Erreur création mode de paiement: ", error);
        throw error;
    }
}
export async function updateDescription(
    id: string,
    nom: string,
    isActive: boolean,
    descriptions: { contenu: string }[]
) {
    try {
        const response = await axios.put(`${API_URL}/payments/payment/${id}`, {
            nom,
            isActive,
            descriptions,
        }, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("Erreur mise à jour description: ", error);
        throw error;
    }
}

