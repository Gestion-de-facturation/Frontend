'use client'

import { useState } from "react";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import '@/styles/order.css';
import '@/styles/form.css';
import toast from "react-hot-toast";

type Props = {
    onClose: () => void;
    onAdd: (newMethod: any) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CreatePaymentMethodForm({ onClose, onAdd }: Props) {
    const [name, setName] = useState("");
    const [descriptions, setDescriptions] = useState<string[]>([""]);
    const [loading, setLoading] = useState(false);

    const addDescription = () => {
        setDescriptions([...descriptions, ""]);
    };

    const handleDescriptionsChange = (index: number, value: string) => {
        const newDescriptions = [...descriptions];
        newDescriptions[index] = value;
        setDescriptions(newDescriptions);
    }

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast("Le nom du mode de paiement est obligatoire");
            return;
        }

        const payload = {
            nom: name.trim(),
            isActive: true,
            descriptions: descriptions
                .filter((d) => d.trim() !== "")
                .map((d) => ({ contenu: d.trim() })),
        };

        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/payments/payment`, payload);
            onAdd(res.data);
            onClose();
            toast.success("Mode de paiement ajouté avec succès")
        } catch (error: any) {
            console.error("Erreur lors de la création du mode de paiement :", error.response?.data || error.message);
            toast.error("Erreur lors de la création du mode de paiement");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-[#14446c] rounded-md text-white create-payment-method-form">
            <div>
                <h3 className="font-semibold text-lg">Ajout d'un mode de paiement</h3>
            </div>
            <div className="flex-column mts">
                <label>Nom du mode de paiement</label>
                <div>
                    <input
                        type="text"
                        className="border border-[#ffffff] rounded create-payment-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-column mts">
                <label>Descriptions</label>
                {descriptions.map((desc, index) => (
                    <div
                        key={index}
                        className="flex gap-2">
                        <input
                            type="text"
                            className="border border-[#ffffff] rounded create-payment-input"
                            value={desc}
                            onChange={(e) => handleDescriptionsChange(index, e.target.value)}
                        />
                        {index === descriptions.length - 1 && (
                            <button
                                type="button"
                                title="Ajouter une description"
                                onClick={addDescription}
                                className="cursor-pointer">
                                <IoMdAdd size={20} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="mts flex gap-3">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="bg-[#cccccc] text-[#14446c] rounded cursor-pointer font-semibold create-payment-form-btn"
                >
                    Annuler
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#f18c08] text-[#14446c] rounded cursor-pointer font-semibold create-payment-form-btn">
                    {loading ? "Création..." : "Ajouter"}
                </button>
            </div>
        </div>
    );
}