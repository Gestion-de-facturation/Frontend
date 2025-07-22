import React from 'react';
import '@/styles/form.css';
import '@/styles/order.css';

type Props = {
    adresseLivraison: string;
    setAdresseLivraison: (value: string) => void;
    adresseFacturation: string;
    setAdresseFacturation: (value: string) => void;
}

export default function OrderAddresses ({
    adresseLivraison,
    setAdresseLivraison,
    adresseFacturation,
    setAdresseFacturation
} : Props) {
    return(
        <div className='flex justify-between form-content-mt mts'>
            <div className="mb-4">
                <label className="block font-medium mb-1">Adresse de livraison</label>
                <textarea 
                value={adresseLivraison}
                onChange={(e) => setAdresseLivraison(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mts" 
                />
            </div>

            <div className="mb-4">
                <label className="block font-medium mb-1">Adresse de facturation</label>
                <textarea 
                value={adresseFacturation}
                onChange={(e) => setAdresseFacturation(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mts" 
                />
            </div>
        </div>
    );
}