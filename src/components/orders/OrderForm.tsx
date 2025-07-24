'use client'

import React, { useState, useEffect } from 'react';
import { Produit } from '@/utils/types/create';
import { BaseOrderParams } from '@/utils/types/BaseOrderParams';
import { useProductSuggestions } from '@/utils/products/useProductSuggestion';
import { validateProductBeforeAdd } from '@/utils/products/validateProductBeforeAdd';
import { removeProduct as removeProductFn } from '@/utils/products/removeProduct';
import OrderAddresses from './OrderAddresses';
import OrderDeliveryCost from './OrderDeliveryCost';
import OrderProductInputs from './OrderProductInputs';
import OrderButton from './OrderButton';
import ConfirmModal from '../modals/ProductConfirmModal';
import toast from 'react-hot-toast';
import { ConfirmModalState } from '@/utils/types/ConfirmModalState';
import { MdAddShoppingCart } from "react-icons/md";
import '@/styles/form.css';
import '@/styles/order.css';
import { loadOrderById } from '@/utils/hooks/useLoadOrder';

type OrderFormProps<T extends BaseOrderParams> = {
  onSubmit: (params: T) => void;
  mode: 'create' | 'update';
  initialValues?: Partial<T> & { produits?: Produit[] } & {
    idCommande?: string;
    date?: string;
  };
};

export default function OrderForm<T extends BaseOrderParams>({
  onSubmit,
  mode,
  initialValues={}
} : OrderFormProps<T>) {

  const [adresseLivraison, setAdresseLivraison] = useState(initialValues.adresseLivraison || '');
  const [adresseFacturation, setAdresseFacturation] = useState(initialValues.adresseFacturation || '');
  const [fraisDeLivraison, setFraisDeLivraison] = useState(initialValues.fraisDeLivraison || '');
  const [produits, setProduits] = useState<Produit[]>(initialValues.produits || [{ nom: '', prixUnitaire: '', quantite: ''}]);

  const [idCommande, setIdCommande] = useState(initialValues?.idCommande || '');
  const [date, setDate] = useState(initialValues?.date?.split('T')[0] ?? '');

  const { 
    suggestions,
    setSuggestions, 
    handleProductChange, 
    handleSelectedSuggestion } = useProductSuggestions(produits, setProduits);
  
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    open: false,
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  // ✅ Fonction de reset utilisée uniquement en mode update
  const resetChampsAdresseModification = () => {
    setAdresseLivraison('');
    setAdresseFacturation('');
    setFraisDeLivraison('');
    setIdCommande('');
    setDate('');
  };

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
    onSubmit({
      ...initialValues,
      produits,
      adresseLivraison,
      adresseFacturation,
      fraisDeLivraison,
      setProduits,
      setSuggestions,
      resetChampsAdresse: mode === 'update'
        ? resetChampsAdresseModification
        : () => {
            setAdresseLivraison('');
            setAdresseFacturation('');
            setFraisDeLivraison('');
          },
      setConfirmModal,
      ...(mode === 'update' && { idCommande, date })
    } as T);
};
  
  const removeProduct = (index: number) => {
    const updated = removeProductFn(index, produits);
    setProduits(updated);
  };

  const title = mode === 'create' ? 'Ajouter une commande' : 'Modifier une commande';

  const handleSearchOrder = async () => {
    if (!idCommande.trim()) return;

    const data = await loadOrderById(idCommande);
    if (data) {
      setProduits(data.produits);
      setAdresseLivraison(data.adresseLivraison);
      setAdresseFacturation(data.adresseFacturation);
      setFraisDeLivraison(data.fraisDeLivrason);
      setDate(data.date?.split('T')[0] || '');
    } else {
      toast.error("Commande introuvable.");
    }
  };


  return (
    <div className="add-form-container max-w-3xl mx-auto p-6 border border-[#cccccc] rounded-md shadow-lg place-self-center mts">
        <h2 className="flex flex-row justify-between text-2xl font-bold  add-form-content">
            {title} <MdAddShoppingCart className='w-8 h-8 text-[#14446c]'/>
        </h2>

        {/**Si c'est update alors ajouter les champs référence et date */}
        {mode === 'update' && (
          <div className="flex justify-between items-center gap-4 mts">
            <div className='flex w-1/2'>
              <div className="flex flex-col">
                <label className="block font-medium mb-1">Référence de la commande</label>
                <input
                  type="text"
                  className="border border-gray-300 h-8 rounded mts"
                  value={idCommande}
                  onChange={(e) => setIdCommande(e.target.value)}
                  placeholder="Ex: FA20250720120000"
                />
              </div>
              <button
                type="button"
                onClick={handleSearchOrder}
                className="bg-blue-600 text-white rounded h-8 search-order-id"
              >
                Rechercher
              </button>
            </div>

            <div className="flex flex-col w-1/2">
              <label className="block font-medium mb-1">Date de la commande</label>
              <input
                type="date"
                className="border border-gray-300 h-8  rounded mts"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        )}

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
      {confirmModal && (
        <ConfirmModal
        open={confirmModal.open}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
        />
      )}
    </div>
  );
}
