'use client'

import { useState } from "react";
import axios from "axios";
import '@/styles/order.css';
import '@/styles/form.css';
import toast from 'react-hot-toast';

type Props = {
    onClose: () => void;
    onAdd: (newCategory: any) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function CreateSupplierForm({ onClose, onAdd }: Props) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast('Le nom du fournisseur est obligatoire');
            return;
        }

        const payload = {
            nom: name.trim(),
            isActive: true
        };

        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/suppliers/supplier`, payload);
            onAdd(res.data);
            onClose();
            toast.success("Fournisseur ajouté avec succès")
        } catch (error: any) {
            console.error("Erreur lors de la création du fournisseur: ", error.response?.data || error.message);
            toast.error("Erreur lors de la création du fournisseur")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-[#14446c] rounded-md text-white create-supplier-form">
            <div>
                <h3 className="font-semibold text-lg">Ajout d'un fournisseur</h3>
            </div>
            <div className="flex-column mts">
                <label>Nom du fournisseur</label>
                <div>
                    <input
                        type="text"
                        className="border border-[#ffffff] rounded create-supplier-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mts flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="bg-[#cccccc] text-[#14446c] rounded cursor-pointer font-semibold create-supplier-form-btn"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#f18c08] text-[#14446c] rounded cursor-pointer font-semibold create-supplier-form-btn"
                    >
                        {loading ? 'Création...' : 'Ajouter'}
                    </button>
                </div>
            </div>
        </div>
    );
}