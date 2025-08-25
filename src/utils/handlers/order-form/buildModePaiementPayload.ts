import { PaymentMethodType } from "@/utils/types/order-form/paymentMethod";

export type ModePaiementPayload = {
    nom: string;
    description: { contenu: string };
    isActive: boolean;
    id?: string;
};

export function buildExistingModePaiementPlayload(
    method: PaymentMethodType,
    selectedDesciption: string
): ModePaiementPayload {
    return {
        nom: method.nom,
        description: { contenu: (selectedDesciption || "").trim() },
        isActive: method.isActive ?? true,
        id: method.id,
    };
}

export function buildNewModePaiementPayload(
    nom: string,
    description?: string,
    isActive: boolean = false
): ModePaiementPayload {
    return {
        nom: nom.trim(),
        description: { contenu: (description || "").trim() },
        isActive,
    };
}