export type PsOrder = {
    id: string;
    adresseLivraison: {
        id: number,
        firstname: string,
        lastname: string,
        company: string,
        address1: string,
        address2: string,
        postcode: string,
        city: string,
        phone: string,
        dni: string,
        country: string,
        state: string
    },
    adresseFacturation: {
        id: number,
        firstname: string,
        lastname: string,
        company: string,
        address1: string,
        address2: string,
        postcode: string,
        city: string,
        phone: string,
        dni: string,
        country: string,
        state: string
    },
    fraisDeLivraison: string;
    date_add: string;
    total_paid_tax_incl: string;
}