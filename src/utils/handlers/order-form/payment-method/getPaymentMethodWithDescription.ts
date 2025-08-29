import { fetchPaymentMethods } from "@/utils/services/paymentMethodService";

export async function getPaymentMethodWithDescription() {
    try {
        const data = await fetchPaymentMethods();
        return data;
    } catch (error) {
        console.error("Handler - Erreur récupération modes de paiement: ", error);
        throw error;
    }
}