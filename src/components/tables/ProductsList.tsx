'use client';

import { useState } from 'react';
import { useProducts } from '@/utils/hooks/useProducts';
import { Produit, ProduitCommande } from '@/utils/types/productList';
import ProductTable from './ProductTable';
import CommandeTable from './OrderTable';
import OrderEditor from './OrderEditorTable';
import toast from 'react-hot-toast';
import axios from 'axios';
import { MdListAlt, MdAdd, MdOutlineEdit  } from "react-icons/md";
import '@/styles/order.css';

export default function ProductsList() {
  const data = useProducts();
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [activePanel, setActivePanel] = useState<'create' | 'edit' | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  //Créer une commande
  const [produitsCommandesCreate, setProduitsCommandesCreate] = useState<ProduitCommande[]>([]);
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [adresseFacturation, setAdresseFacturation] = useState('');
  const [fraisDeLivraison, setFraisDeLivraison] = useState<number>(0);

  //Modifier une commande
  const [produitsCommandesEdit, setProduitsCommandesEdit] = useState<ProduitCommande[]>([]);
  
  const addProductCreate = (produit: Produit, quantite: number) => {
    const exist = produitsCommandesCreate.find(p => p.idProduit === produit.id);
    if (exist) return toast.error(`${produit.nom} déjà ajouté`);
    if (!quantite || quantite <= 0) return toast.error('Quantité invalide');
  
    setProduitsCommandesCreate(prev => [...prev, {
      idProduit: produit.id,
      nom: produit.nom,
      quantite,
      prixUnitaire: produit.prixUnitaire
    }]);
    toast.success(`${quantite} ${produit.nom} ajouté`);
  };

  const addProductEdit = (produit: Produit, quantite: number) => {
    const exist = produitsCommandesEdit.find(p => p.idProduit === produit.id);
    if (exist) return toast.error(`${produit.nom} déjà ajouté`);
    if (!quantite || quantite <= 0) return toast.error('Quantité invalide');

    setProduitsCommandesEdit(prev => [...prev, {
      idProduit: produit.id,
      nom: produit.nom,
      quantite,
      prixUnitaire: produit.prixUnitaire
    }]);
    toast.success(`${quantite} ${produit.nom} ajouté`);
  };

  const orderCreate = async () => {    
    if (!adresseLivraison || !adresseFacturation || produitsCommandesCreate.length === 0) {
      toast.error('Veuillez remplir toutes les informations nécessaires et ajouter au moins un produit');
      return;
    }

    try {
      const body = {
        adresse_livraison: adresseLivraison,
        adresse_facturation: adresseFacturation,
        frais_de_livraison: Number(fraisDeLivraison),
        date: new Date().toISOString(),
        produits: produitsCommandesCreate.map(p => ({ idProduit: p.idProduit, quantite: p.quantite }))
      };

      const res = await axios.post(`${API_URL}/orders/order`, body);
      console.log("Commande envoyée :", body);
      toast.success('Commande passée avec succès ! ' + res.data.orderId);

      setProduitsCommandesCreate([]);
      setAdresseLivraison('');
      setAdresseFacturation('');
      setFraisDeLivraison(0);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    }
  };

  const orderEdit = async () => {    
    if (!adresseLivraison || !adresseFacturation || produitsCommandesEdit.length === 0) {
      toast.error('Veuillez remplir toutes les informations nécessaires et ajouter au moins un produit');
      return;
    }

    try {
      const body = {
        adresse_livraison: adresseLivraison,
        adresse_facturation: adresseFacturation,
        frais_de_livraison: Number(fraisDeLivraison),
        date: new Date().toISOString(),
        produits: produitsCommandesEdit.map(p => ({ idProduit: p.idProduit, quantite: p.quantite }))
      };

      const res = await axios.post(`${API_URL}/orders/order`, body);
      console.log("Commande envoyée :", body);
      toast.success('Commande passée avec succès ! ' + res.data.orderId);

      setProduitsCommandesEdit([]);
      setAdresseLivraison('');
      setAdresseFacturation('');
      setFraisDeLivraison(0);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    }
  };

  return (
    <div className="flex flex-row-reverse gap-8 order">
      <div className="flex-col panel">
          <div className='order-table border border-[#cccccc] rounded-lg hover:shadow-md panel-content max-h-[71vh] overflow-y-auto overflow-x-hidden'>
              <h2 className="flex flex-row justify-between text-2xl font-bold  mts  cursor-pointer"
               onClick={() => setActivePanel(activePanel === 'create' ? null : 'create')}>
                Ajouter une commande <MdAdd className='w-8 h-8 text-[#cccccc] hover:text-[#14446c]'/>
              </h2>


              {activePanel === 'create' && (
              <div>
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

                <CommandeTable produitsCommandes={produitsCommandesCreate} 
                removeProduct={(id) => setProduitsCommandesCreate(prev => prev.filter(p => p.idProduit !== id))}   
                fraisDeLivraison={fraisDeLivraison}
                setFraisDeLivraison={setFraisDeLivraison}/>

                <button
                    onClick={orderCreate}
                    className="bg-[#f18c08] text-white text-md rounded-md w-24 h-12 mts cursor-pointer self-end order-btn"
                >
                    Commander
                </button>
              </div>
            )}
          </div>
          <div className='order-table border border-[#cccccc] rounded-lg hover:shadow-md panel-content max-h-[71vh] overflow-y-auto overflow-x-hidden'>     
              <h2 className="flex flex-row justify-between text-2xl font-bold  mts cursor-pointer"
              onClick={() => setActivePanel(activePanel === 'edit' ? null : 'edit')}>
                Modifier une commande <MdOutlineEdit className='w-8 h-8 text-[#cccccc] hover:text-[#14446c]'/>
              </h2>
              {activePanel === 'edit' && (
                <OrderEditor  
                  dataProduits={data}
                  pagination={pagination}
                  setPagination={setPagination}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  produitsCommandes={produitsCommandesEdit}
                  setProduitsCommandes={setProduitsCommandesEdit}
                  /> 
              )}        
          </div>
        </div>
      
        <div className='border border-[#cccccc] rounded-lg hover:shadow-md productlist-section'>
            <h2 className="flex flex-row justify-between text-2xl font-bold mb-4 mts r">
              Liste des produits<MdListAlt className='w-8 h-8 text-[#cccccc] hover:text-[#14446c]' />
            </h2>
            <ProductTable
                data={data}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addProduct={activePanel === 'edit' ? addProductEdit : addProductCreate}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
      </div>
        
  );
}