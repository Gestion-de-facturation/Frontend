// utils/products/useProductSuggestions.ts

import { useState } from "react";
import axios from "axios";
import { Produit } from "../types/create";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useProductSuggestions(
  produits: Produit[],
  setProduits: (p: Produit[]) => void
) {
  const [suggestions, setSuggestions] = useState<Record<number, any[]>>({});

  const handleProductChange = async (index: number, nom: string) => {
    const newProduits = [...produits];
    newProduits[index].nom = nom;
    setProduits(newProduits);

    if (nom.length >= 2) {
      try {
        const res = await axios.get(`${API_URL}/products/product?name=${nom}`);
        const data = res.data;
        setSuggestions((prev) => ({ ...prev, [index]: data.length ? data : [] }));
      } catch (err) {
        setSuggestions((prev) => ({ ...prev, [index]: [] }));
      }
    } else {
      setSuggestions((prev) => ({ ...prev, [index]: [] }));
    }
  };

  const handleSelectedSuggestion = (index: number, produit: any) => {
    const updated = [...produits];
    updated[index] = {
      ...updated[index],
      nom: produit.nom,
      prixUnitaire: produit.prixUnitaire,
      fromSuggestion: true,
    };
    setProduits(updated);
    setSuggestions((prev) => ({ ...prev, [index]: [] }));
  };

  return { suggestions,setSuggestions, handleProductChange, handleSelectedSuggestion };
}
