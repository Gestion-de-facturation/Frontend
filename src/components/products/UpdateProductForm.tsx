"use client";

import { useEffect, useState } from 'react';
import ProductRef from './ProductRef';
import ProductDetails from './ProductDetails';
import ProductButton from './ProductButton';
import { Produit } from '@/utils/types/products/Produit';
import { fetchProduct } from '@/utils/handlers/products/update-form/fetchProduct';
import { updateProduct } from '@/utils/handlers/products/update-form/updateProduct';
import { handleChange } from '@/utils/handlers/products/update-form/handleChange';
import toast from 'react-hot-toast';
import { useLoading } from '@/store/useLoadingStore';
import LoadingOverlay from '../spinners/LoadingOverlay';
import '@/styles/order.css';
import '@/styles/product.css';

interface UpdateProductFormProps {
    productId: string;
}

export default function UpdateProductForm({ productId }: UpdateProductFormProps) {
    const [product, setProduct] = useState<Produit | null>(null);
    const { isLoading, show, hide } = useLoading();

    useEffect(() => {
        async function loadProduct() {
            try {
                show();
                const data = await fetchProduct(productId);
                setProduct(data);
            } catch (err) {
                toast.error("Impossible de charger le produit");
            } finally {
                hide();
            }
        }
        loadProduct();
    }, [productId, show, hide]);

    const handleSave = async () => {
        if (!product) return;

        const productToSend = {
            nom: product.nom,
            prixUnitaire: product.prixUnitaire,
            idCategorie: product.categorie.id,
            idFournisseur: product.fournisseur.id
        };

        console.log(`Product to send: ${JSON.stringify(productToSend, null, 2)}`);

        try {
            show();
            await updateProduct(productId, productToSend);
            toast.success("Produit mis à jour avec succès");
        } catch (err) {
            toast.error("Echec de la mise à jour du  produit");
        } finally {
            hide();
        }
    };

    if (!product) return <p>Produit introuvable.</p>

    return (
        <div className='mts product-modif-form w-[80%]'>
            <LoadingOverlay />
            <h1 className="text-3xl font-bold">Modification produit</h1>
            <ProductRef reference={product.id} />
            <ProductDetails
                product={product}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    handleChange(e, setProduct)}
            />
            <ProductButton onSave={handleSave} />
        </div>
    )
}