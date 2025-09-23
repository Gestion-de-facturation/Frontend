'use client'

import React, { useEffect, useState } from 'react';
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
import { ModePaiementPayload } from '@/utils/handlers/order-form/buildModePaiementPayload';
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
  const [echeance, setEcheance] = useState(initialValues.echeance || 0);
  const [delai, setDelai] = useState(initialValues.delai || 0);

  const [idCommande, setIdCommande] = useState(initialValues?.idCommande || '');
  const [reference, setReference] = useState(initialValues?.reference || '');
  const [date, setDate] = useState(initialValues?.date?.split('T')[0] ?? '');

  const title = mode === 'create' ? 'Nouvelle Commande' : 'Modifier une commande';
  const totaux = calculTotalAmount(produits, fraisDeLivraison);

  const [modePaiement, setModePaiement] = useState<ModePaiementPayload | null>(initialValues.modePaiement || null);

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

  useEffect(() => {
    if (mode === 'update' && initialValues.produits) {
      setProduits(initialValues.produits);
      setAdresseLivraison(initialValues.adresseLivraison || '');
      setAdresseFacturation(initialValues.adresseFacturation || '');
      setFraisDeLivraison(initialValues.fraisDeLivraison || '');
      setStatutLivraison(initialValues.statutLivraison || 'en_cours');
      setStatutPaiement(initialValues.statutPaiement || 'en_attente');
      setOrderType(initialValues.orderType || 'devis');
      setEcheance(initialValues.echeance || 0);
      setDelai(initialValues.delai || 0);
      setModePaiement(initialValues.modePaiement || null);
      setIdCommande(initialValues.idCommande || '');
      setReference(initialValues.reference || '');
      setDate(initialValues.date?.split('T')[0] ?? '');
    } else {
      const saved = localStorage.getItem("orderFormData");
      if (saved) {
        const data = JSON.parse(saved);
        setProduits(data.produits || [{ nom: '', prixUnitaire: '', quantite: '' }]);
        setAdresseLivraison(data.adresseLivraison || '');
        setAdresseFacturation(data.adresseFacturation || '');
        setFraisDeLivraison(data.fraisDeLivraison || '');
        setStatutLivraison(data.statutLivraison || 'en_cours');
        setStatutPaiement(data.statutPaiement || 'en_attente');
        setOrderType(data.orderType || 'devis');
        setEcheance(data.echeance || 0);
        setDelai(data.delai || 0);
        setModePaiement(data.modePaiement || null);
        setIdCommande(data.idCommande || '');
        setReference(data.reference || '');
        setDate(data.date || '');
      }
    }
  }, [
    mode,
    initialValues.produits,
    initialValues.adresseLivraison,
    initialValues.adresseFacturation,
    initialValues.fraisDeLivraison,
    initialValues.statutLivraison,
    initialValues.statutPaiement,
    initialValues.orderType,
    initialValues.echeance,
    initialValues.delai,
    initialValues.modePaiement,
    initialValues.idCommande,
    initialValues.reference,
    initialValues.date
  ]);


  // --- Sauvegarde automatique dans localStorage pour formulaire non enregistré ---
  useEffect(() => {
    if (mode === 'create') {
      const data = {
        adresseLivraison,
        adresseFacturation,
        produits,
        fraisDeLivraison,
        statutLivraison,
        statutPaiement,
        orderType,
        echeance,
        delai,
        modePaiement,
        idCommande,
        reference,
        date
      };
      localStorage.setItem("orderFormData", JSON.stringify(data));
    }
  }, [
    adresseLivraison,
    adresseFacturation,
    produits,
    fraisDeLivraison,
    statutLivraison,
    statutPaiement,
    orderType,
    echeance,
    delai,
    modePaiement,
    idCommande,
    reference,
    date,
    mode
  ]);

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
        echeance,
        delai,
        modePaiement,
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
            setEcheance(0);
            setDelai(0);
            setModePaiement(null);
          },
        setConfirmModal,
        ...(mode === 'update' && { idCommande, date })
      } as T);

    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    } finally {
      hide();
    }

    localStorage.removeItem("orderFormData");
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
      setEcheance,
      setDelai,
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
    setEcheance(0);
    setDelai(0);
    setFraisDeLivraison('');
    setDate('');
    setIdCommande('');
    setReference('');
    localStorage.removeItem("orderFormData");
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
          echeance={echeance}
          setEcheance={setEcheance}
          optionsLivraison={optionsLivraison}
          optionsPaiement={optionsPaiement}
          orderType={orderType}
          delai={delai}
          setDelai={setDelai}
        />

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

        {/* Méthode de paiement */}
        <PaymentMethod onChange={setModePaiement} value={modePaiement} />

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
