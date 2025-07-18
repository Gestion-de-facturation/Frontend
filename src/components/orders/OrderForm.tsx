import React from 'react';
import { MdAddShoppingCart } from "react-icons/md";
import '@/styles/form.css';
import '@/styles/order.css';

export default function SimpleOrderForm() {
  return (
    <div className="add-form-container max-w-3xl mx-auto p-6 border border-[#cccccc] rounded-md shadow-lg place-self-center mts">
        <h2 className="flex flex-row justify-between text-2xl font-bold  add-form-content">
            Ajouter une commande <MdAddShoppingCart className='w-8 h-8 text-[#14446c]'/>
        </h2>

        <div className='flex justify-between form-content-mt mts'>
            {/* Adresse de livraison */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Adresse de livraison</label>
                <textarea className="w-full border border-gray-300 p-2 rounded mts" />
            </div>

            {/* Adresse de facturation */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Adresse de facturation</label>
                <textarea className="w-full border border-gray-300 p-2 rounded mts" />
            </div>
        </div>

      {/* Produits */}
      <div className="mb-4 form-content-mt">
        <label className="block font-medium mb-2">Produits</label>

        <div className="grid grid-cols-4 gap-2 mb-2 mts">
          <input type="text" placeholder="Nom du produit" className="border p-1 rounded col-span-1 h-8" />
          <input type="number" placeholder="Prix unitaire" className="border p-1 rounded" />
          <input type="number" placeholder="Quantité" className="border p-1 rounded" />
          <input type="text" value="Montant: 0 Ar" readOnly className="border p-1 rounded" />
        </div>

        <button className="text-sm text-[#f18c08] hover:underline mts cursor-pointer">+ Ajouter un produit</button>
      </div>

      {/* Frais de livraison */}
      <div className="mb-4 form-content-mt">
        <label className="block font-medium mb-1">Frais de livraison</label>
        <input type="number" className="border p-2 rounded mts w-32 h-8" />
        <span className='span-ml'>Ar</span>
      </div>

      {/* Total */}
      <div className="mb-4 form-content-mt">
        <label className="block font-medium mb-1">Total </label>
        <input type="text" value="0 Ar" readOnly className="w-64 h-8 bg-gray-100 p-2 rounded text-gray-700 mts" />
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 form-content-mt">
        <button className="px-4 py-2 border rounded bg-gray-100 cursor-pointer w-24 h-8 font-semibold">Annuler</button>
        <button className="px-4 py-2 border rounded bg-[#14446c] text-white cursor-pointer w-24 h-8 font-semibold">Commander</button>
      </div>
    </div>
  );
}
