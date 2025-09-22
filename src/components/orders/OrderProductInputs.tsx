import React from "react";
import { FaMinus } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import '@/styles/form.css';
import '@/styles/order.css';
import { formatPrice } from "@/utils/functions/formatPrice";

type Produit = {
    nom: string;
    prixUnitaire: string;
    quantite: string;
    fromSuggestion?: boolean;
}

type Props = {
    produits: Produit[];
    suggestions: Record<number, any[]>;
    handleProductChange: (index: number, value: string) => void;
    handleSelectedSuggestion: (index: number, produit: any) => void;
    setProduits: React.Dispatch<React.SetStateAction<Produit[]>>;
    removeProduct: (index: number) => void;
    addProduct: () => void;
};

export default function OrderProductInputs({
    produits,
    suggestions,
    handleProductChange,
    handleSelectedSuggestion,
    setProduits,
    removeProduct,
    addProduct
}: Props) {
    return (
        <div className="border border-[#cccccc] rounded-md shadow-sm order-products-container">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold">Produits</h2>
                <button
                    type='button'
                    onClick={addProduct}
                    className="flex gap-2 border border-[#cccccc] font-semibold rounded hover:bg-[#ccccccc9] cursor-pointer add-order-product-btn">
                    <IoMdAdd className="order-product-add-btn font-semibold" /> Ajouter un produit
                </button>
            </div>
            {produits.map((p, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 mb-2 mts">
                    <input
                        type="text"
                        placeholder="Nom du produit"
                        value={p.nom}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        className="border p-1 rounded col-span-2 h-8 form-input-padding-left" />
                    {suggestions[index]?.length > 0 && (
                        <ul className='absolute suggestion-mt bg-white border w-96 max-h-40 overflow-auto z-10'>
                            {suggestions[index].map((s) => (
                                <li
                                    key={s.id}
                                    className='p-1 hover:bg-gray-200 cursor-pointer'
                                    onClick={() => handleSelectedSuggestion(index, s)}
                                >
                                    {s.nom} - <span className='font-semibold'>{s.prixUnitaire.toLocaleString()} Ar</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <input
                        type="text"
                        placeholder="Prix"
                        value={p.prixUnitaire ? formatPrice(p.prixUnitaire) : ""}
                        onChange={(e) => setProduits((prev) =>
                            prev.map((item, i) => i === index ? { ...item, prixUnitaire: e.target.value.replace(/\s/g, '') } : item)
                        )}
                        className="border p-1 rounded h-8 form-input-padding-left" />
                    <input
                        type="text"
                        placeholder="Quantité"
                        value={p.quantite ? formatPrice(p.quantite) : ""}
                        onChange={(e) => setProduits((prev) =>
                            prev.map((item, i) => i === index ? { ...item, quantite: e.target.value.replace(/\s/g, '') } : item)
                        )}
                        className="border p-1 rounded h-8 form-input-padding-left" />
                    <input
                        type="text"
                        value={`${formatPrice(
                            (parseInt(p.quantite || '0') * parseFloat(p.prixUnitaire || '0')) || 0
                        )} Ar`}
                        readOnly
                        className="border p-1 rounded font-semibold h-8" />
                    <button
                        type='button'
                        onClick={() => removeProduct(index)}
                        className='flex gap-2 cursor-pointer text-red-600 h-8 hover:text-red-500'
                    >
                        <FaMinus className='delete-icon-color' />
                        <span className='delete-span'>Supprimer</span>
                    </button>
                </div>
            ))}
        </div>
    );
}