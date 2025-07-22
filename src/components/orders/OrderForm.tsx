'use client'

import React, {useState, useEffect } from 'react';
import axios from 'axios';
import { Produit } from '@/utils/types/create';
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
  const [suggestions, setSuggestions] = useState<Record<number, any[]>>({});

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    open: false,
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  //Gérer les suggestions de produits à chaque frappe
  const handleProductChange = async (index: number, nom: string) => {
    const newProduits = [...produits];
    newProduits[index].nom = nom;
    setProduits(newProduits);

    if (nom.length >= 2) {
      try {
        const res = await axios.get(`${API_URL}/products/product?name=${nom}`);
        const data = res.data;

        // Met à jour les suggestions seulement s’il y en a
        setSuggestions((prev) => ({ ...prev, [index]: data.length ? data : [] }));
          } catch (err) {
            // Vide les suggestions si une erreur
            setSuggestions((prev) => ({ ...prev, [index]: [] }));
          }
        } else {
          // Vide les suggestions si saisie < 2 lettres
          setSuggestions((prev) => ({ ...prev, [index]: [] }));
        }
  };

  const handleSelectedSuggestion = (index: number, produit: any) => {
    const updated = [...produits];
    updated[index] = {
      ...updated[index],
      nom: produit.nom,
      prixUnitaire: produit.prixUnitaire,
    };
    setProduits(updated);
    setSuggestions((prev) => ({ ...prev, [index]: []}));
  };

  const addProduct = () => {
    const lastProduct = produits[produits.length - 1];

    if (!lastProduct) {
      toast.error("Produit invalide.");
      return;
    }

    const nom = lastProduct.nom?.trim();
    const prix = parseFloat(lastProduct.prixUnitaire);
    const quantite = parseInt(lastProduct.quantite);

    const isValid =
      nom !== '' &&
      !isNaN(prix) && prix > 0 &&
      !isNaN(quantite) && quantite > 0;

    if (!isValid) {
      toast.error("Veuillez remplir correctement le dernier produit avant d'en ajouter un autre.");
      return;
    }

    // Vérifie si ce nom existe déjà dans un produit autre que le dernier
    const existeDeja = produits.slice(0, -1).some(
      (p) => p.nom.trim().toLowerCase() === nom.toLowerCase()
    );

    if (existeDeja) {
      toast.error("Ce produit a déjà été ajouté à la commande.");
      return;
    }

    // Ajouter un nouveau champ vide
    setProduits([...produits, { nom: '', prixUnitaire: '', quantite: '' }]);
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
