'use client'

import React, { useState } from 'react';
import { Produit } from '@/utils/types/create';
import { optionsLivraison, optionsPaiement, optionsType } from '@/utils/types/order-form/Options';
import { BaseOrderParams } from '@/utils/types/BaseOrderParams';
import { useProductSuggestions } from '@/utils/products/useProductSuggestion';
import { removeProduct as removeProductFn } from '@/utils/products/removeProduct';
import { resetChampsAdresseModification } from '@/utils/functions/order-form/resetChampsAdresseModification';
import { addProductFn } from '@/utils/functions/order-form/addProductFn';
import { calculTotalAmount } from '@/utils/functions/order-form/calculTotalAmount';
import { handleSearchOrderFn } from '@/utils/handlers/order-form/handleSearchOrderFn';
import { useLoading } from '@/store/useLoadingStore';
import OrderAddresses from './OrderAddresses';
import OrderDeliveryCost from './OrderDeliveryCost';
import PaymentMethod from './PaymentMethod';
import OrderStatus from './OrderStatus';
import OrderProductInputs from './OrderProductInputs';
import OrderButton from './OrderButton';
import OrderType from './OrderType';
import { OrderFormDetails } from './OrderFormDetails';
import { OrderSummary } from './OrderSummary';
import ConfirmModal from '../modals/ProductConfirmModal';
import { ConfirmModalState } from '@/utils/types/ConfirmModalState';
import '@/styles/form.css';
import '@/styles/order.css';
import '@/app/responsive.css';

type OrderFormProps<T extends BaseOrderParams> = {
  onSubmit: (params: T) => void;
  mode: 'create' | 'update';
  initialValues?: Partial<T> & { produits?: Produit[] } & {
    idCommande?: string;
    reference?: string;
    date?: string;
  };
};

export default function OrderForm<T extends BaseOrderParams>({
  onSubmit,
  mode,
  initialValues = {}
}: OrderFormProps<T>) {
  const [adresseLivraison, setAdresseLivraison] = useState(initialValues.adresseLivraison || '');
  const [adresseFacturation, setAdresseFacturation] = useState(initialValues.adresseFacturation || '');
  const [fraisDeLivraison, setFraisDeLivraison] = useState(initialValues.fraisDeLivraison || '');
  const [produits, setProduits] = useState<Produit[]>(initialValues.produits || [{ nom: '', prixUnitaire: '', quantite: '' }]);

  const [statutLivraison, setStatutLivraison] = useState(initialValues.statutLivraison || 'en_cours');
  const [statutPaiement, setStatutPaiement] = useState(initialValues.statutPaiement || 'en_attente');
  const [orderType, setOrderType] = useState(initialValues.orderType || 'devis');

  const [idCommande, setIdCommande] = useState(initialValues?.idCommande || '');
  const [reference, setReference] = useState(initialValues?.reference || '');
  const [date, setDate] = useState(initialValues?.date?.split('T')[0] ?? '');

  const title = mode === 'create' ? 'Nouvelle Commande' : 'Modifier une commande';
  const totaux = calculTotalAmount(produits, fraisDeLivraison);

  const {
    suggestions,
    setSuggestions,
    handleProductChange,
    handleSelectedSuggestion } = useProductSuggestions(produits, setProduits);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    open: false,
    message: '',
    onConfirm: () => { },
    onCancel: () => { },
  });

  const addProduct = () => {
    addProductFn(produits, setProduits);
  };

  const handleSubmit = async () => {
    const { show, hide } = useLoading.getState();

    try {
      show();

      await onSubmit({
        ...initialValues,
        produits,
        adresseLivraison,
        adresseFacturation,
        fraisDeLivraison,
        statutLivraison,
        statutPaiement,
        orderType,
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
            setOrderType('devis');
          },
        setConfirmModal,
        ...(mode === 'update' && { idCommande, date })
      } as T);

    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    } finally {
      hide();
    }
  };

  const removeProduct = (index: number) => {
    const updated = removeProductFn(index, produits);
    setProduits(updated);
  };

  const handleSearchOrder = () => {
    handleSearchOrderFn(
      idCommande,
      reference,
      setProduits,
      setAdresseLivraison,
      setAdresseFacturation,
      setStatutLivraison,
      setStatutPaiement,
      setOrderType,
      setFraisDeLivraison,
      setDate
    );
  };

  const handleCancel = () => {
    setProduits([{ nom: '', prixUnitaire: '', quantite: '' }]);
    setAdresseLivraison('');
    setAdresseFacturation('');
    setStatutLivraison('');
    setStatutPaiement('');
    setOrderType('');
    setFraisDeLivraison('');
    setDate('');
    setIdCommande('');
    setReference('');
  }

  return (
    <div className="flex justify-evenly 2xl:justify-around add-form-container mts ">
      <div>
        <div className='flex justify-between'>
          <h1 className="flex flex-row justify-between text-3xl font-bold  add-form-content">
            {title}
          </h1>
          <OrderType
            orderType={orderType}
            setOrderType={setOrderType}
            optionsType={optionsType}
          />
        </div>

        {/**Si c'est update alors ajouter les champs référence et date */}
        {mode === 'update' && (
          <OrderFormDetails reference={reference} setReference={setReference} idCommande={idCommande} setIdCommande={setIdCommande} handleSearchOrder={handleSearchOrder} date={date} setDate={setDate} />
        )}

        <OrderStatus
          statutLivraison={statutLivraison}
          setStatutLivraison={setStatutLivraison}
          statutPaiement={statutPaiement}
          setStatutPaiement={setStatutPaiement}
          optionsLivraison={optionsLivraison}
          optionsPaiement={optionsPaiement} />

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

        {/* Méthode de paiement */}
        <PaymentMethod />
      </div>

      <div>
        {/* Boutons */}
        <OrderButton
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
        {/**Récapitulatif */}
        <OrderSummary totalProduits={totaux.totalProduits} total={totaux.total} fraisDeLivraison={fraisDeLivraison || ''} />
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
