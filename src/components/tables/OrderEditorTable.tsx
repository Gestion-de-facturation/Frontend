'use client'

import { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import CommandeTable from "./OrderTable";
import ProductTable from "./ProductTable";
import { ProduitCommande, Produit } from "@/utils/types/productList";
import { FaSearch } from "react-icons/fa";
import '@/styles/order.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  dataProduits: Produit[];
  pagination: any;
  setPagination: any;
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
  produitsCommandes: ProduitCommande[];
  setProduitsCommandes: (val: ProduitCommande[]) => void;
};

export default function OrderEditor({
  dataProduits,
  pagination,
  setPagination,
  globalFilter,
  setGlobalFilter,
  produitsCommandes,
  setProduitsCommandes,
}: Props) {
    const [commandeId, setCommandeId] = useState('');
    const [commandeData, setCommandeData] = useState<any>(null);
    const [adresseLivraison, setAdresseLivraison] = useState('');
    const [adresseFacturation, setAdresseFacturation] = useState('');
    const [date, setDate] = useState<string>('');
    const [fraisDeLivraison, setFraisDeLivraison] = useState(0);

    const fetchCommande = async () => {
        try {
            const res = await axios.get(`${API_URL}/orders/${commandeId}`);
            const data = res.data;
            setCommandeData(data);
            setAdresseLivraison(data.adresse_livraison);
            setAdresseFacturation(data.adresse_facturation);
            setFraisDeLivraison(data.frais_de_livraison || 0);
            setDate(data.date.split('T')[0]);
            setProduitsCommandes(
                data.commandeProduits.map((item: any) => ({
                    idProduit: item.idProduit,
                    nom: item.produit.nom,
                    quantite: item.quantite,
                    prixUnitaire: item.produit.prixUnitaire,
                }))
            );
            toast.success('Commande chargée');
        } catch (err) {
            toast.error('Commande introuvable');
        }
    };

    const updateCommande = async () => {
        if (!adresseLivraison || !adresseFacturation || !date || produitsCommandes.length === 0) {
            toast.error('Veuillez remplir toutes les informations nécessaires.');
            return ;
        }
        try {
            const body = {
                adresse_livraison: adresseLivraison,
                adresse_facturation: adresseFacturation,
                frais_de_livraison: Number(fraisDeLivraison),
                date: date,
                produits: produitsCommandes.map((p) => ({
                    idProduit: p.idProduit,
                    quantite: p.quantite,
                })),
            };

            await axios.put(`${API_URL}/orders/order/${commandeId}`, body);
            toast.success('Commande mise à jour avec succès !');
        } catch (err) {
            console.error(err);
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const removeProduct = (idProduit: string) => {
        const updatedList = produitsCommandes.filter((p) => p.idProduit !== idProduit);
        setProduitsCommandes(updatedList);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4  mts">
                <input 
                type="text" 
                placeholder="Référence de la commande"
                className="border p-2 rounded w-64 h-10"
                value={commandeId}
                onChange={(e) => setCommandeId(e.target.value)}
                />
                <button
                onClick={fetchCommande}
                className=" px-4 py-2 rounded  hover:text-[#f18c08]"
                title="Rechercher"
                >
                    <FaSearch className="w-5 h-5"/>
                </button>
            </div>

            {commandeData && (
                <>
                    <div className="grid grid-cols-2 gap-4 mts">
                        <textarea 
                        className="border p-2 rounded"
                        placeholder="Adresse de livraison"
                        value={adresseLivraison}
                        onChange={(e) => setAdresseLivraison(e.target.value)}
                        />
                        <textarea 
                        className="border p-2 rounded"
                        placeholder="Adresse de facturation"
                        value={adresseFacturation}
                        onChange={(e) => setAdresseFacturation(e.target.value)}
                        />
                        <div className="date-container flex gap-4">
                            <label className="date-label font-semibold">Date: </label>
                            <input 
                            type="date" 
                            className="border p-2 rounded h-8"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <CommandeTable 
                    produitsCommandes={produitsCommandes}
                    removeProduct={removeProduct}
                    fraisDeLivraison={fraisDeLivraison}
                    setFraisDeLivraison={setFraisDeLivraison}
                    />

                    <button 
                    onClick={updateCommande}
                    className="bg-[#f18c08] text-white text-md rounded-md w-24 h-12 mts cursor-pointer self-end order-btn"
                    >
                        Enregistrer
                    </button>
                    
                </>
            )}
        </div>
    )
}

