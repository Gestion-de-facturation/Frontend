'use client'

import { ProduitCommande } from '@/utils/types/productList';
import { MdRemoveCircleOutline } from 'react-icons/md';
import '@/styles/order.css'

type Props = {
  produitsCommandes: ProduitCommande[];
  removeProduct: (idProduit: string) => void;
  fraisDeLivraison: number;
  setFraisDeLivraison: (val: number) => void;
};

export default function CommandeTable({ produitsCommandes, removeProduct, fraisDeLivraison, setFraisDeLivraison }: Props) {

  const totalProduits = produitsCommandes.reduce(
    (acc, p) => acc + p.quantite * p.prixUnitaire,
    0
  );

  const totalGlobal = totalProduits + fraisDeLivraison;

  return (
    <div className="mb-6 mts">
      <h3 className="font-semibold mbs">Produits sélectionnés</h3>
      {produitsCommandes.length === 0 ? (
        <p className="text-gray-500">Aucun produit ajouté</p>
      ) : (
        <ul className="mb-4 border rounded p-4 bg-gray-100 shadow">
          {produitsCommandes.map((produit) => (
            <li
              key={produit.idProduit}
              className="grid grid-cols-3 gap-8 items-center border-b pls"
            >
              <div>
                <p className="font-medium">{produit.nom}</p>
                <p className="text-sm text-gray-600">
                  {produit.quantite} × {produit.prixUnitaire.toLocaleString()} Ar
                </p>
              </div>
              <p className="font-semibold">
                {(produit.quantite * produit.prixUnitaire).toLocaleString()} Ar
              </p>
              <button
                onClick={() => removeProduct(produit.idProduit)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
              >
                <MdRemoveCircleOutline className="w-4 h-4" /> Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className='flex justify-between'>
        <div className='flex gap-2 mts'>
          <p>Frais de livraison: </p>
          <input 
          id="frais"
          type="number" 
          min={0}
          className='border border-[#14446cab] w-24 h-6 rounded'
          value={fraisDeLivraison}
          onChange={(e) => {
            const value = e.target.value;
            setFraisDeLivraison(value === '' ? 0 : Number(value));
          }}
          />
        </div>
        <div className="text-right font-bold text-lg mts">Total : {totalGlobal.toLocaleString()} Ar</div>
      </div>
    </div>
  );
}
