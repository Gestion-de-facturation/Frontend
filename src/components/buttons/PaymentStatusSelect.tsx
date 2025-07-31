'use client';

import { useState } from "react";
import axios from "axios";
import { statusColor } from "@/utils/functions/statusColor";
import { IoMdCloseCircle } from "react-icons/io";
import toast from "react-hot-toast";
import '@/styles/toast.css'

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
            toast.custom((t) => (
                <div className={`bg-white border rounded-md relative shadow-md flex items-start justify-between gap-2 w-80 status-toast`} role="alert">
                    <div>
                        <strong className="font-bold">Succès : </strong>
                        <span className="block sm:inline">Statut de facturation de la commande n° {idCommande} mis à jour de <span className="text-[#f18c08]">{statutActuel}</span> à <span className="text-[#f18c08]">{nouveauStatut}</span>.</span>
                    </div>
                    <button
                        className="ml-4 text-red-800 font-bold"
                        onClick={() => toast.dismiss(t.id)}
                        title="fermer"
                    >
                        <IoMdCloseCircle className="text-lg"/>
                    </button>
                </div>
            ), { duration: Infinity });
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
        className={`border rounded text-sm ${statusColor(statut).color}`}
        >
            {options.map(opt => (
                <option 
                key={opt} 
                value={opt}
                className={`${statusColor(opt).color}`}
                >{statusColor(opt).value}</option>
            ))}
        </select>
    );
}