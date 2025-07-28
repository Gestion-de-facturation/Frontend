'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Produit } from '@/utils/types/create';
import { BaseOrderParams } from '@/utils/types/BaseOrderParams';
import { useProductSuggestions } from '@/utils/products/useProductSuggestion';
import { validateProductBeforeAdd } from '@/utils/products/validateProductBeforeAdd';
import { removeProduct as removeProductFn } from '@/utils/products/removeProduct';
import OrderAddresses from './OrderAddresses';
import OrderDeliveryCost from './OrderDeliveryCost';
import OrderStatus from './OrderStatus';
import OrderProductInputs from './OrderProductInputs';
import OrderButton from './OrderButton';
import ConfirmModal from '../modals/ProductConfirmModal';
import toast from 'react-hot-toast';
import { ConfirmModalState } from '@/utils/types/ConfirmModalState';
import { FaSearch } from "react-icons/fa";
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

  const router = useRouter();

  const [adresseLivraison, setAdresseLivraison] = useState(initialValues.adresseLivraison || '');
  const [adresseFacturation, setAdresseFacturation] = useState(initialValues.adresseFacturation || '');
  const [fraisDeLivraison, setFraisDeLivraison] = useState(initialValues.fraisDeLivraison || '');
  const [produits, setProduits] = useState<Produit[]>(initialValues.produits || [{ nom: '', prixUnitaire: '', quantite: ''}]);
  
  const [statutLivraison, setStatutLivraison] = useState(initialValues.statutLivraison || 'en_cours');
  const [statutPaiement, setStatutPaiement] = useState(initialValues.statutPaiement || 'en_attente');

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
      statutLivraison,
      statutPaiement,
      setProduits,
      setSuggestions,
      resetChampsAdresse: mode === 'update'
        ? resetChampsAdresseModification
        : () => {
            setAdresseLivraison('');
            setAdresseFacturation('');
            setFraisDeLivraison('');
            setStatutLivraison('en_cours');
            setStatutPaiement('en_attente');
          },
      setConfirmModal,
      ...(mode === 'update' && { idCommande, date })
    } as T);
};
  
  const removeProduct = (index: number) => {
    const updated = removeProductFn(index, produits);
    setProduits(updated);
  };

  const title = mode === 'create' ? 'Nouvelle Commande' : 'Modifier une commande';

  const handleSearchOrder = async () => {
    if (!idCommande.trim()) return;

    const data = await loadOrderById(idCommande);
    if (data) {
      setProduits(data.produits);
      setAdresseLivraison(data.adresseLivraison);
      setAdresseFacturation(data.adresseFacturation);
      setStatutLivraison(data.statutLivraison);
      setStatutPaiement(data.statutPaiement);
      setFraisDeLivraison(data.fraisDeLivrason);
      setDate(data.date?.split('T')[0] || '');
    } else {
      toast.error("Commande introuvable.");
    }
  };

  const optionsLivraison = [
  { label: 'En cours', value: 'en_cours' },
  { label: 'Livré', value: 'livré' },
  { label: 'Reporté', value: 'reporté' },
  { label: 'Annulé', value: 'annulé' },
];

  const optionsPaiement = [
    { label: 'En attente', value: 'en_attente' },
    { label: 'Validé', value: 'validé' },
    { label: 'Annulé', value: 'annulé' },
  ];

  return (
    <div className="flex justify-evenly add-form-container mts ">
      <div>
        <h1 className="flex flex-row justify-between text-3xl font-bold  add-form-content">
            {title} 
        </h1>

        {/**Si c'est update alors ajouter les champs référence et date */}
        {mode === 'update' && (
          <div className='mts border border-[#cccccc] rounded-md shadow-sm order-update-details-container'>
            <h2 className='text-xl font-bold'>Détails</h2>
            <div className="flex justify-between items-center gap-4 mts">
              <div className='flex gap-2 w-1/2'>
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
                  className="rounded h-8 cursor-pointer search-order-id"
                  title='Rechercher'
                >
                  <FaSearch className='text-lg hover:text-[#f18c08]'/>
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
          </div>
        )}

        <OrderStatus 
        statutLivraison={statutLivraison}
        setStatutLivraison={setStatutLivraison}
        statutPaiement={statutPaiement}
        setStatutPaiement={setStatutPaiement}
        optionsLivraison={optionsLivraison}
        optionsPaiement={optionsPaiement}/>

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
    </div>

    <div>
      {/* Boutons */}
      <OrderButton 
        handleSubmit={handleSubmit}
      />
      {/**Récapitulatif */}
      <div className='border border-[#cccccc] shadow-sm rounded order-sum-container'>
        <h2 className='text-xl font-bold'>Récapitulatif</h2>
        {/** Sous-total */}
        <div className="flex mb-4 form-content-mt gap-2 w-80 h-10 mts">
          <label className="w-64 font-medium mts"> Sous-total:  </label>
          <p className="w-64 h-8  p-2 rounded  mts ">{totalProduits} Ar</p>
        </div>

          {/* Frais de livraison */}
          <div className="flex mb-4 form-content-mt gap-2 w-80 h-10 mts">
            <label className="w-64 font-medium">Frais de livraison:  </label>
            <p className="w-64 h-8  p-2 rounded font-semi-bold">{fraisDeLivraison || '0'} Ar</p>
          </div>

          {/**Total */}
          <div className="flex justify-between border-t-2 border-[#cccccc] font-semibold text-lg total-container">
            <label>Total</label>
            <p>{total} Ar</p>
          </div>
      </div>
    </div>

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
