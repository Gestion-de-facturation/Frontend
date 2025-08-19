export type Order = {
    id: string;
    adresseLivraison: string;
    adresseFacturation: string;
    fraisDeLivraison: number;
    date: string;
    total: number;
    isDeleted?: boolean;
}