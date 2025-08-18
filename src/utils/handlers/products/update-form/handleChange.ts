import { Produit } from "@/utils/types/products/Produit";
import React from "react";

type FormEl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setProduct: React.Dispatch<React.SetStateAction<Produit | null>>
) {
  const { name, value } = e.target;

  setProduct((prev) =>
    prev
      ? {
          ...prev,
          [name]: name === "prixUnitaire" ? Number(value) : value,
        }
      : prev
  );
}

