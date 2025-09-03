'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdAdd } from 'react-icons/io';
import toast from 'react-hot-toast';
import '@/styles/order.css';
import '@/styles/form.css';

type Description = {
    id: string;
    contenu: string;
    idMode: string;
};

type PaymentMethod = {
    id: string;
    nom: string;
    isActive: boolean;
    descriptions: Description[];
};

type Props = {
    onClose: () => void;
    method: PaymentMethod;
    onUpdate: (updated: PaymentMethod) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UpdatePaymentMethod({ onClose, method, onUpdate }: Props) {
    const [name, setName] = useState('');
    const [descriptions, setDescriptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Initialisation du formulaire à chaque changement de method
    useEffect(() => {
        if (method) {
            setName(method.nom);
            if (method.descriptions.length > 0) {
                setDescriptions(method.descriptions.map(d => d.contenu));
            } else {
                setDescriptions(['']);
            }
        }
    }, [method]);

    const addDescription = () => {
        setDescriptions([...descriptions, '']);
    };

    const handleDescriptionsChange = (index: number, value: string) => {
        const newDescriptions = [...descriptions];
        newDescriptions[index] = value;
        setDescriptions(newDescriptions);
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error('Le nom du mode de paiement est obligatoire');
            return;
        }

        const payload = {
            nom: name.trim(),
            isActive: true,
            descriptions: descriptions
                .filter(d => d.trim() !== '')
                .map(d => ({ contenu: d.trim() })),
        };

        try {
            setLoading(true);
            const res = await axios.put(`${API_URL}/payments/payment/${method.id}`, payload);
            onUpdate(res.data); // renvoie la nouvelle version du mode
            toast.success('Mode de paiement mis à jour !');
            onClose();
        } catch (error) {
            console.error('Erreur lors de la mise à jour.', error);
            toast.error('Échec de la mise à jour.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-[#14446c] rounded-md text-white update-payment-method-form'>
            <div className="font-semibold text-lg">Mise à jour</div>
            <div className="flex-column">
                <label>Nom du mode de paiement</label>
                <div>
                    <input
                        type="text"
                        className='border border-[#ffffff] rounded update-payment-input'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-column mts">
                <label>Descriptions</label>
                {descriptions.map((desc, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            className="border border-[#ffffff] rounded update-payment-input"
                            value={desc}
                            onChange={e => handleDescriptionsChange(index, e.target.value)}
                        />
                        {index === descriptions.length - 1 && (
                            <button
                                className="cursor-pointer"
                                title='Ajouter une description'
                                type='button'
                                onClick={addDescription}
                            >
                                <IoMdAdd size={20} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="mts flex gap-3">
                <button
                    className="bg-[#cccccc] text-[#14446c] rounded cursor-pointer font-semibold update-payment-form-btn"
                    onClick={onClose}
                    type='button'
                    disabled={loading}
                >
                    Annuler
                </button>
                <button
                    className="bg-[#f18c08] text-[#14446c] rounded cursor-pointer font-semibold update-payment-form-btn"
                    type='button'
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </div>
    );
}
