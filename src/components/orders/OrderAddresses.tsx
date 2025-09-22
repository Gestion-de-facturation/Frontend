import React, { useEffect, useState } from 'react';
import '@/styles/form.css';
import '@/styles/order.css';
import '@/app/responsive.css';

type Props = {
    adresseLivraison: string;
    setAdresseLivraison: (value: string) => void;
    adresseFacturation: string;
    setAdresseFacturation: (value: string) => void;
}

const STORAGE_KEY_LIVRAISON = 'adressesLivraison';
const STORAGE_KEY_FACTURATION = 'adressesFacturation';

export default function OrderAddresses({
    adresseLivraison,
    setAdresseLivraison,
    adresseFacturation,
    setAdresseFacturation
}: Props) {
    const [suggestionsLivraison, setSuggestionLivraison] = useState<string[]>([]);
    const [suggestionsFacturation, setSuggestionFacturation] = useState<string[]>([]);

    useEffect(() => {
        const savedLivraison = JSON.parse(localStorage.getItem(STORAGE_KEY_LIVRAISON) || '[]');
        const savedFacturation = JSON.parse(localStorage.getItem(STORAGE_KEY_FACTURATION) || '[]');
        setSuggestionLivraison(savedLivraison);
        setSuggestionFacturation(savedFacturation);
    }, []);

    const updateSuggestions = (key: string, value: string, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (!value.trim()) return;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        if (!existing.includes(value)) {
            const updated = [value, ...existing].slice(0, 10);
            localStorage.setItem(key, JSON.stringify(updated));
            setSuggestions(updated);
        }
    };

    return (
        <div className='border border-[#cccccc] rounded-md order-addresses-container shadow-sm'>
            <h2 className='text-xl font-bold'>Adresses de la commande</h2>
            <div className='flex justify-between form-content-mt mts'>
                <div className="w-64">
                    <label className="block font-medium mb-1">Adresse de livraison</label>
                    <textarea
                        value={adresseLivraison}
                        onChange={(e) => {
                            setAdresseLivraison(e.target.value);
                            updateSuggestions(STORAGE_KEY_LIVRAISON, e.target.value, setSuggestionLivraison);
                        }}
                        className="w-full h-22 border border-gray-300 rounded mts order-adresses-textarea form-input-padding-left"
                        placeholder={`Nom du client:\nAdesse du client:\nContact:\n`}
                    />
                    {adresseLivraison && (
                        <ul className="absolute z-10 bg-white border border-[#ccccccc] rounded shadow w-64 max-h-32 overflow-auto">
                            {suggestionsLivraison.filter(s => s.toLowerCase().includes(adresseLivraison.toLowerCase()) && s != adresseLivraison).map((s, idx) => (
                                <li key={idx}
                                    className='hover:bg-[#cccccc] cursor -pointer'
                                    onClick={() => setAdresseLivraison(s)}
                                >
                                    {s}
                                </li>
                            ))
                            }
                        </ul>
                    )}
                </div>

                <div className="w-64">
                    <label className="block font-medium mb-1">Adresse de facturation</label>
                    <textarea
                        value={adresseFacturation}
                        onChange={(e) => {
                            setAdresseFacturation(e.target.value);
                            updateSuggestions(STORAGE_KEY_FACTURATION, e.target.value, setSuggestionFacturation);
                        }}
                        placeholder={`Nom du client:\nAdesse du client:\nContact:\n`}
                        className="w-full h-22 border border-gray-300 p-2 rounded mts order-adresses-textarea form-input-padding-left"
                    />
                </div>
                {adresseFacturation && (
                    <ul className="absolute z-10 bg-white border border-[#ccccccc] rounded shadow w-64 max-h-32 overflow-auto adresse-facturation-sugg">
                        {suggestionsLivraison.filter(s => s.toLowerCase().includes(adresseFacturation.toLowerCase()) && s != adresseFacturation).map((s, idx) => (
                            <li key={idx}
                                className='hover:bg-[#cccccc] cursor -pointer'
                                onClick={() => setAdresseFacturation(s)}
                            >
                                {s}
                            </li>
                        ))
                        }
                    </ul>
                )}
            </div>
        </div>
    );
}