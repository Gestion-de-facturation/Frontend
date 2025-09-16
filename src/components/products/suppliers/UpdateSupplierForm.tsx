'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Supplier } from "./SupplierList";
import '@/styles/order.css';
import '@/styles/form.css';


type Props = {
    onClose: () => void;
    category: Supplier;
    onUpdate: (updated: Supplier) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UpdateSupplierForm({ onClose, category, onUpdate }: Props) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.nom);
        }
    }, [category]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error('Le nom du fournisseur est obligatoire.')
            return;
        }

        const payload = {
            nom: name.trim(),
            isActive: true
        };

        try {
            setLoading(true);
            const res = await axios.put(`${API_URL}/suppliers/supplier/${category.id}`, payload);
            onUpdate(res.data);
            toast.success('Fournisseur mis à jour!');
            onClose();
        } catch (error) {
            console.error('Erreur lors de la mise à jour.', error);
            toast.error('Echec de la mise à jour.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#14446c] rounded-md text-white update-supplier-form">
            <div className="font-semiblod text-lg"> Mise à jour </div>
            <div className="flex-column">
                <label>Nom du fournisseur</label>
                <div>
                    <input
                        type="text"
                        className="border border-[#ffffff] rounded update-supplier-input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
            </div>
            <div className="mts flex gap-3">
                <button
                    className="bg-[#cccccc] text-[#14446c] rounded cursor-pointer font-semibold update-supplier-form-btn"
                    onClick={onClose}
                    type="button"
                    disabled={loading}
                >
                    Annuler
                </button>
                <button
                    className="bg-[#f18c08] text-[#14446c] rounded cursor-pointer font-semibold update-supplier-form-btn"
                    onClick={handleSubmit}
                    type="button"
                    disabled={loading}
                >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </div>
    )
}