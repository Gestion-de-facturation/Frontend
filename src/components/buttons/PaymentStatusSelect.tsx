'use client';

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
    idCommande: string;
    statutActuel: string;
};

const options = ['en_attente', 'validé', 'annulé'];

export default function PaymentStatusSelect({ idCommande, statutActuel } : Props) {
    const [statut, setStatut] = useState(statutActuel);
    const [loading, setLoading] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nouveauStatut = e.target.value;
        setStatut(nouveauStatut);
        setLoading(true);

        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/orders/order/paymentstatus/${idCommande}`, {
                statut_paiement: nouveauStatut
            });
            toast.success(`Statut de paiement de la commande n° ${idCommande} mise à jour en ${nouveauStatut}`);
        } catch(error) {
            toast.error('Erreur lors de la mise à jour du statut de paiement');
            setStatut(statutActuel);
        } finally {
            setLoading(false);
        }
    };

    return (
        <select 
        value={statut}
        onChange={handleChange}
        disabled={loading}
        className="border rounded text-sm"
        >
            {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    );
}