import React from "react";
import { Produit } from "@/utils/types/products/Produit";

type Props = {
    label: string;
    name: keyof Produit | string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export default function ProductDetailsContent({ label, name, value, onChange }: Props) {
    return (
        <div>
            <label className="block font-medium product-modif-content-mt">{label}</label>
            <textarea
                name={name}
                value={value}
                className="w-64 h-22 border border-gray-300 rounded product-modif-content-mt product-input"
                onChange={onChange}
            />
        </div>
    )
}