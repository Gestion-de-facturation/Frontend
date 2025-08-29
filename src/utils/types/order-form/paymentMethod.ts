export type PaymentMethodType= {
    id: string;
    nom: string;
    isActive: boolean;
    descriptions?: {
        contenu: string;
    }[] | null;
    selectedDescription?: string | null;
}