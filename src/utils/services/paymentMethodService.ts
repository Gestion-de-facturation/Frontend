import axios from "axios";
import { PaymentMethodType } from "../types/order-form/paymentMethod";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export async function fetchPaymentMethods() {
    try {
        const { data } = await axios.get(`${API_URL}/payments`, {
            headers: { "Content-Type": "application/json" },
        });

        const normalized: PaymentMethodType[] = (Array.isArray(data) ? data : []).map((pm: any) => ({
            id: pm?.id,
            nom: pm?.nom,
            isActive: Boolean(pm?.isActive),
            descriptions: Array.isArray(pm?.descriptions)
                ? pm.descriptions
                    .map((d: any) => d?.contenu)
                    .filter((v: unknown): v is string => typeof v === "string" && v.trim().length > 0)
                : [],
        }));

        return normalized;
    } catch (error) {
        console.error("Service - Erreur récupération modes de paiement: ", error);
        throw error;
    }
}