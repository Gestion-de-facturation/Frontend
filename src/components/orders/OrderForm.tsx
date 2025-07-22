'use client'

import React, {useState, useEffect } from 'react';
import axios from 'axios';
import { Produit } from '@/utils/types/create';
import { useProductSuggestions } from '@/utils/products/useProductSuggestion';
import { validateProductBeforeAdd } from '@/utils/products/validateProductBeforeAdd';
import { handleSubmitOrder } from '@/utils/handlers/handleSubmitOrder';
import OrderAddresses from './OrderAddresses';
import OrderDeliveryCost from './OrderDeliveryCost';
import OrderProductInputs from './OrderProductInputs';
import OrderButton from './OrderButton';
import ConfirmModal from '../modals/ProductConfirmModal';
import { ConfirmModalState } from '@/utils/types/ConfirmModalState';
import { toast } from 'react-hot-toast';
import { MdAddShoppingCart } from "react-icons/md";
import '@/styles/form.css';
import '@/styles/order.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrderForm() {
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [adresseFacturation, setAdresseFacturation] = useState('');
  const [fraisDeLivraison, setFraisDeLivraison] = useState('');
  const [produits, setProduits] = useState<Produit[]>([{nom: '', prixUnitaire: '', quantite: ''}]);

  const { suggestions,setSuggestions, handleProductChange, handleSelectedSuggestion } =
  useProductSuggestions(produits, setProduits);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    open: false,
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const addProduct = () => {
    const isValid = validateProductBeforeAdd(produits);
    if (!isValid) return;
    setProduits([...produits, { nom: "", prixUnitaire: "", quantite: "" }]);
  };


  const totalProduits = produits.reduce((sum, p) => {
  const prix = parseFloat(p.prixUnitaire || '0');
  const quantiteInt = parseInt(String(p.quantite || '0'));
    return sum + quantiteInt * prix;
  }, 0);
  const total = totalProduits + Number(fraisDeLivraison);

  const handleSubmit = () => {
    handleSubmitOrder({
      produits,
      adresseLivraison,
      adresseFacturation,
      fraisDeLivraison,
      setProduits,
      setSuggestions,
      resetChampsAdresse: () => {
        setAdresseLivraison('');
        setAdresseFacturation('');
        setFraisDeLivraison('');
      },
      setConfirmModal
    });
};
  
  const removeProduct = (index: number) => {
    if (produits.length === 1) {
      setProduits([{ nom: '', prixUnitaire: '', quantite: '' }]);
    } else {
      const updated = [...produits];
      updated.splice(index, 1);
      setProduits(updated);
    }
  };



  return (
    <div className="add-form-container max-w-3xl mx-auto p-6 border border-[#cccccc] rounded-md shadow-lg place-self-center mts">
        <h2 className="flex flex-row justify-between text-2xl font-bold  add-form-content">
            Ajouter une commande <MdAddShoppingCart className='w-8 h-8 text-[#14446c]'/>
        </h2>

        <OrderAddresses 
          adresseLivraison={adresseLivraison}
          setAdresseLivraison={setAdresseLivraison}
          adresseFacturation={adresseFacturation}
          setAdresseFacturation={setAdresseFacturation}
        />

      {/* Produits */}
      <OrderProductInputs 
        produits={produits}
        suggestions={suggestions}
        handleProductChange={handleProductChange}
        handleSelectedSuggestion={handleSelectedSuggestion}
        setProduits={setProduits}
        removeProduct={removeProduct}
        addProduct={addProduct}
      />
      

      {/* Frais de livraison */}
      <OrderDeliveryCost 
        fraisDeLivraison={fraisDeLivraison}
        setFraisDeLivraison={setFraisDeLivraison}
      />

      {/* Total */}
      <div className="flex mb-4 form-content-mt gap-2 w-64 h-10 mts">
        <label className="block font-medium mb-1 mts">Total:  </label>
        <p className="w-64 h-8  p-2 rounded  mts font-semibold">{total} Ar</p>
      </div>

      {/* Boutons */}
      <OrderButton 
        handleSubmit={handleSubmit}
      />

      {/*Confirm Modal*/}
      <ConfirmModal
      open={confirmModal.open}
      message={confirmModal.message}
      onConfirm={confirmModal.onConfirm}
      onCancel={confirmModal.onCancel}
      />
    </div>
  );
}
