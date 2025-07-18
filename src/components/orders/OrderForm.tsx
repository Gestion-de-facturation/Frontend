'use client'

import React, {useState, useEffect } from 'react';
import axios from 'axios';
import { Produit } from '@/utils/types/create';
import { toast } from 'react-hot-toast';
import { MdAddShoppingCart } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import '@/styles/form.css';
import '@/styles/order.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrderForm() {
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [adresseFacturation, setAdresseFacturation] = useState('');
  const [fraisDeLivraison, setFraisDeLivraison] = useState('');
  const [produits, setProduits] = useState<Produit[]>([{nom: '', prixUnitaire: '', quantite: ''}]);
  const [suggestions, setSuggestions] = useState<Record<number, any[]>>({});

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

  const handleSubmit = async () => {
    try {
      // Vérification des champs et doublons
      const nomsProduits = new Set<string>();

      for (const produit of produits) {
        const nom = produit.nom?.trim().toLowerCase();
        const prix = parseFloat(produit.prixUnitaire);
        const quantite = parseInt(produit.quantite);

        if (!nom || isNaN(prix) || prix <= 0 || isNaN(quantite) || quantite <= 0) {
          toast.error(`Produit invalide : "${produit.nom}"`);
          return;
        }

        if (nomsProduits.has(nom)) {
          toast.error(`Produit en double détecté : "${produit.nom}"`);
          return;
        }

        nomsProduits.add(nom);
      }

      const produitsEnBase = await Promise.all(
        produits.map(async (p) => {
          try {
            const res = await axios.get(`${API_URL}/products/product?name=${encodeURIComponent(p.nom)}`);
            const existant = res.data.find((item: any) => item.nom === p.nom);
            if (existant) return { id: existant.id, ...p };

            const creation = await axios.post(`${API_URL}/products/product`, {
              nom: p.nom,
              prixUnitaire: p.prixUnitaire,
              idFournisseur: "SUP20250627-153508",
              idCategorie: "CAT20250627-153441"
            });

            return { id: creation.data.id, ...p};

          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              const creation = await axios.post(`${API_URL}/products/product`, {
                nom: p.nom,
                prixUnitaire: parseFloat(p.prixUnitaire),
                idFournisseur: "SUP20250627-153508",
                idCategorie: "CAT20250627-153441"
              });

              return { id: creation.data.id, ...p };
            } else {
              toast.error(`Erreur lors de la création du produit ${p.nom}. Veuillez réessayer.`);
            }
          }
        })
      );

      const order = {
        adresse_livraison: adresseLivraison,
        adresse_facturation: adresseFacturation,
        frais_de_livraison: Number(fraisDeLivraison || 0),
        date: new Date().toISOString().split("T")[0], // pour envoyer la date du jour
        produits: produitsEnBase
          .filter((p): p is NonNullable<typeof p> => p !== undefined)
          .map((p) => ({
            idProduit: p.id, 
            quantite: parseInt(String(p.quantite || '0'))
          }))
      };

      await axios.post(`${API_URL}/orders/order`, order);
      toast.success('Commande passée avec succès !');
      setSuggestions({}); 
      setProduits([{ nom: '', prixUnitaire: '', quantite: '' }]);      
      setAdresseLivraison('');
      setAdresseFacturation('');
      setFraisDeLivraison('');
    } catch (error) {
      toast.error('Erreur lors de la commande. Veuillez réessayer.');
    }
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

      {/* Produits */}
      <div className="mb-4 form-content-mt">
        <label className="block font-medium mb-2">Produits</label>
        {produits.map((p, index) => (
          <div key={index} className="grid grid-cols-6 gap-2 mb-2 mts">
            <input 
            type="text" 
            placeholder="Nom du produit" 
            value={p.nom}
            onChange = {(e) => handleProductChange(index, e.target.value)}
            className="border p-1 rounded col-span-2 h-8" />
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
            type="number" 
            placeholder="Prix unitaire" 
            value={p.prixUnitaire}
            onChange={(e) => setProduits((prev) =>
                        prev.map((item, i) => i === index ? { ...item, prixUnitaire: e.target.value } : item)
                      )}
            className="border p-1 rounded h-8" />
            <input 
            type="number" 
            placeholder="Quantité" 
            value={p.quantite}
            onChange={(e) => setProduits((prev) =>
                        prev.map((item, i) => i === index ? { ...item, quantite: e.target.value } : item)
                      )}
            className="border p-1 rounded h-8" />
            <input 
            type="text" 
            value={`${
                isNaN(parseInt(String(p.quantite || '0')) * parseFloat(p.prixUnitaire))
                  ? 0
                  : parseInt(String(p.quantite || '0')) * parseFloat(p.prixUnitaire)
              } Ar`} 
            readOnly 
            className="border p-1 rounded font-semibold h-8" />
            <button 
            type='button'
            onClick={() => removeProduct(index)}
            className='flex gap-2 cursor-pointer text-red-600 h-8 hover:text-red-500'
            >
              <FaMinus className='delete-icon-color'/>
              <span className='delete-span'>Supprimer</span>
            </button>
          </div>
        ))}

        <button 
        type='button'
        onClick={addProduct}
        className="text-sm text-[#f18c08] hover:underline mts cursor-pointer">
          + Ajouter un produit
        </button>
      </div>
      

      {/* Frais de livraison */}
      <div className="mb-4 form-content-mt">
        <label className="block font-medium mb-1">Frais de livraison</label>
        <input 
        type="number" 
        value={fraisDeLivraison}
        onChange={(e) => setFraisDeLivraison(e.target.value)}
        className="border p-2 rounded mts w-32 h-8" />
        <span className='span-ml'>Ar</span>
      </div>

      {/* Total */}
      <div className="flex mb-4 form-content-mt gap-2 w-64 h-10 mts">
        <label className="block font-medium mb-1 mts">Total:  </label>
        <p className="w-64 h-8  p-2 rounded  mts font-semibold">{total} Ar</p>
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 form-content-mt">
        <button className="px-4 py-2 border rounded bg-gray-100 cursor-pointer w-24 h-8 font-semibold">Annuler</button>
        <button 
        onClick={handleSubmit}
        className="px-4 py-2 border rounded bg-[#14446c] text-white cursor-pointer w-24 h-8 font-semibold hover:bg-[#f18c08]">
          Commander
        </button>
      </div>
    </div>
  );
}
