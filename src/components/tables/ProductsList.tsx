'use client';

import { useState } from 'react';
import { useProducts } from '@/utils/hooks/useProducts';
import { Produit, ProduitCommande } from '@/utils/types/productList';
import ProductTable from './ProductTable';
import CommandeTable from './OrderTable';
import toast from 'react-hot-toast';
import axios from 'axios';
import { MdListAlt, MdAdd } from "react-icons/md";
import '@/styles/order.css';

export default function ProductsList() {
  const data = useProducts();
  const [globalFilter, setGlobalFilter] = useState('');
  const [produitsCommandes, setProduitsCommandes] = useState<ProduitCommande[]>([]);
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [adresseFacturation, setAdresseFacturation] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const addProduct = (produit: Produit, quantite: number) => {
  const exist = produitsCommandes.find(p => p.idProduit === produit.id);

  if (exist) {
    toast.error(`${produit.nom} est déjà dans la commande`);
    return;
  }

  if (!quantite || quantite <= 0) {
    toast.error("Quantité invalide");
    return;
  }

  setProduitsCommandes(prev => [
    ...prev,
    {
      idProduit: produit.id,
      nom: produit.nom,
      quantite,
      prixUnitaire: produit.prixUnitaire
    }
  ]);

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
    <div className="flex flex-row-reverse gap-8 order">
        <div className='order-table border border-[#cccccc] rounded-lg hover:shadow-md'>
            <h2 className="flex flex-row justify-between text-2xl font-bold  mts">
              Ajouter une commande <MdAdd className='w-8 h-8 text-[#cccccc] hover:text-[#14446c]'/>
            </h2>

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
                className="bg-[#f18c08] text-white text-md rounded-md w-24 h-12 mts cursor-pointer self-end order-btn"
            >
                Commander
            </button>
        </div>
      
        <div className='border border-[#cccccc] rounded-lg hover:shadow-md productlist-section'>
            <h2 className="flex flex-row justify-between text-2xl font-bold mb-4 mts r">
              Liste des produits<MdListAlt className='w-8 h-8 text-[#cccccc] hover:text-[#14446c]' />
            </h2>

            <ProductTable
                data={data}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addProduct={addProduct}
                pagination={pagination}
                setPagination={setPagination}
            />
            </div>
        </div>
  );
}