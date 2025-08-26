import { PaymentMethodType } from "@/utils/types/order-form/paymentMethod";

export type ModePaiementPayload = {
    nom: string;
    description: { contenu: string };
    isActive: boolean;
    id?: string;
};

export function buildExistingModePaiementPlayload(
    method: PaymentMethodType,
    selectedDescription: string
): ModePaiementPayload {
    return {
        id: method.id,
        nom: method.nom,
        description: { contenu: (selectedDescription || "").trim() },
        isActive: method.isActive ?? true,
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