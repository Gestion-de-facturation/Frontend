'use client';

import { useState } from "react";
import axios from "axios";
import { statusColor } from "@/utils/functions/statusColor";
import toast from "react-hot-toast";

type Props = {
    idCommande: string;
    statutActuel: string;
};

const options = ['en_cours', 'livré', 'reporté', 'annulé'];

export default function DeliveryStatusSelect({ idCommande, statutActuel } : Props) {
    const [statut, setStatut] = useState(statutActuel);
    const [loading, setLoading] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nouveauStatut = e.target.value;
        setStatut(nouveauStatut);
        setLoading(true);

        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/orders/order/deliverystatus/${idCommande}`, {
                statut_livraison: nouveauStatut
            });
            toast.success(`Statut de livraison de la commande n° ${idCommande} mise à jour en ${nouveauStatut}`);
        } catch(error) {
            toast.error('Erreur lors de la mise à jour du statut de livraison');
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
        className={`border rounded text-sm ${statusColor(statut).color}`}
        >
            {options.map(opt => (
                <option key={opt} value={opt} className={`${statusColor(opt).color}`}>{opt}</option>
            ))}
        </select>
    );
}