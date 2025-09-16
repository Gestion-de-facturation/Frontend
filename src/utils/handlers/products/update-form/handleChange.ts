import { Produit } from "@/utils/types/products/Produit";
import React from "react";

export function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setProduct: React.Dispatch<React.SetStateAction<Produit | null>>
) {
  const { name, value } = e.target;

  setProduct((prev) => {
    if (!prev) return prev;

    const keys = name.split(".");
    const updated = { ...prev } as any;
    let current = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      current[key] = { ...current[key] };
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = lastKey === "prixUnitaire" ? Number(value) : value;

    return updated as Produit;
  });
}