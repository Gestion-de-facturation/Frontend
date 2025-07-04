'use client';

import { useState } from 'react';
import { useProducts } from '@/utils/hooks/useProducts';
import { Produit, ProduitCommande } from '@/utils/types/productList';
import ProductTable from './ProductTable';
import CommandeTable from './OrderTable';
import toast from 'react-hot-toast';
import axios from 'axios';
import '@/styles/order.css';

export default function ProductsList() {
  const data = useProducts();
  const [globalFilter, setGlobalFilter] = useState('');
  const [produitsCommandes, setProduitsCommandes] = useState<ProduitCommande[]>([]);
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [adresseFacturation, setAdresseFacturation] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const addProduct = (produit: Produit) => {
    const exist = produitsCommandes.find(p => p.idProduit === produit.id);

    if (exist) {
      toast.error(`${produit.nom} est déjà ajouté`);
      return;
    }

    const quantite = parseInt(prompt(`Quantité pour ${produit.nom}`) || '1', 10);
    if (isNaN(quantite) || quantite <= 0) {
      toast.error('Quantité invalide');
      return;
    }

    setProduitsCommandes(prev => [...prev, {
      idProduit: produit.id,
      nom: produit.nom,
      quantite,
      prixUnitaire: produit.prixUnitaire
    }]);

    toast.success(`${quantite} ${produit.nom} ajouté à la commande`);
  };

  const removeProduct = (idProduit: string) => {
    setProduitsCommandes(prev => prev.filter(p => p.idProduit !== idProduit));
  };

  const order = async () => {
    if (!adresseLivraison || !adresseFacturation || produitsCommandes.length === 0) {
      alert('Veuillez remplir toutes les informations nécessaires et ajouter au moins un produit');
      return;
    }

    try {
      const body = {
        adresse_livraison: adresseLivraison,
        adresse_facturation: adresseFacturation,
        date: new Date().toISOString(),
        produits: produitsCommandes.map(p => ({ idProduit: p.idProduit, quantite: p.quantite }))
      };

      const res = await axios.post(`${API_URL}/orders/order`, body);
      alert('Commande passée avec succès ! ' + res.data.id);

      setProduitsCommandes([]);
      setAdresseLivraison('');
      setAdresseFacturation('');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    }
  };

  return (
    <div className="p-6 max-w-5xl order">
      <h2 className="text-2xl font-bold mb-4 place-self-center">Ajouter une commande</h2>

      <div className="grid grid-cols-2 gap-4 mts">
        <textarea
          className="border p-2 rounded input-padding"
          placeholder="Adresse de livraison"
          value={adresseLivraison}
          onChange={(e) => setAdresseLivraison(e.target.value)}
        />
        <textarea
          className="border p-2 rounded input-padding"
          placeholder="Adresse de facturation"
          value={adresseFacturation}
          onChange={(e) => setAdresseFacturation(e.target.value)}
        />
      </div>

      <CommandeTable produitsCommandes={produitsCommandes} removeProduct={removeProduct} />

      <button
        onClick={order}
        className="bg-[#f18c08] text-white text-lg rounded-md w-36 h-12 mts cursor-pointer"
      >
        Commander
      </button>

      <h2 className="text-2xl font-bold mb-4 mts place-self-center">Liste des produits</h2>

      <ProductTable
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        addProduct={addProduct}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}