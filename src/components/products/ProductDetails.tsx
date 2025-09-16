import React from "react";
import { Produit } from "@/utils/types/products/Produit";
import ProductDetailsContent from "./ProductDetailsContent";

interface Props {
    product: Produit;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function ProductDetails({ product, onChange }: Props) {
    return (
        <div className='border border-[#cccccc] mts rounded-md product-modif-container'>
            <h2 className="text-xl font-bold">Détails du produit</h2>
            <div className="flex justify-between">
                <ProductDetailsContent name="nom" label="Nom du produit" value={product.nom} onChange={onChange} />
                <ProductDetailsContent name="categorie.nom" label="Catégorie" value={product.categorie.nom} onChange={onChange} />
                <ProductDetailsContent name="fournisseur.nom" label="Fournisseur" value={product.fournisseur.nom} onChange={onChange} />
            </div>
            <div>
                <label className="block font-medium product-modif-content-mt">Prix unitaire</label>
                <input
                    type="number"
                    name="prixUnitaire"
                    value={product.prixUnitaire}
                    className="w-40 border border-gray-300 border-r-none rounded product-modif-content-mt product-input"
                    onChange={onChange}
                />
                <span>Ar</span>
            </div>
        </div>
    )
}