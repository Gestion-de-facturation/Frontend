import { fetchPaymentMethods } from "./paymentMethodService";

export async function getPaymentMethodWithDescription() {
    try {
        const data = await fetchPaymentMethods();
        return data;
    } catch (error) {
        console.error("Erreur récupération modes de paiement: ", error);
        throw error;
    }
}