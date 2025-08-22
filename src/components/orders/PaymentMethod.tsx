"use client"

import { useState } from "react";
import { MdAddBox } from "react-icons/md";
import { FaCheckSquare } from "react-icons/fa";
import { MdDisabledByDefault } from "react-icons/md";
import '@/styles/form.css';
import '@/styles/order.css';

type PaymentMethod = {
    id: string;
    nom: string;
    descriptions: string[];
    selectedDescription: string | null;
};

export default function PaymentMethod() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        { id: "PAYM1", nom: "MVola", descriptions: ["Transfert rapide", "Paiement facture"], selectedDescription: null },
        { id: "PAYM2", nom: "Orange Money", descriptions: ["Achat crédit", "Transfert"], selectedDescription: null },
        { id: "PAYM3", nom: "Airtel Money", descriptions: ["Paiement en ligne"], selectedDescription: null },
    ]);

    const [selected, setSelected] = useState<string>('');
    const [isAddingMethod, setIsAddingMethod] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const [addingDescriptionFor, setAddingDescriptionFor] = useState<string | null>(null);
    const [tempDescription, setTempDescription] = useState("");

    // Sélection d'une description
    const handleSelectDescription = (methodId: string, description: string | null) => {
        setPaymentMethods((prev) =>
            prev.map((m) =>
                m.id === methodId ? { ...m, selectedDescription: description } : m
            )
        );
    };

    // Modification d'une description existante
    const handleChangeDescription = (methodId: string, index: number, newValue: string) => {
        setPaymentMethods((prev) =>
            prev.map((pm) =>
                pm.id === methodId
                    ? {
                        ...pm,
                        descriptions: pm.descriptions.map((d, i) => (i === index ? newValue : d)),
                        selectedDescription: pm.selectedDescription === pm.descriptions[index] ? newValue : pm.selectedDescription,
                    }
                    : pm
            )
        );
    };

    // Ajouter une nouvelle description via input
    const handleSaveNewDescription = (methodId: string) => {
        if (!tempDescription.trim()) return;
        setPaymentMethods((prev) =>
            prev.map((pm) =>
                pm.id === methodId
                    ? { ...pm, descriptions: [...pm.descriptions, tempDescription.trim()], selectedDescription: tempDescription.trim() }
                    : pm
            )
        );
        setTempDescription("");
        setAddingDescriptionFor(null);
    };

    // Ajouter un nouveau mode de paiement
    const handleSaveNewPaymentMethod = () => {
        if (!newName.trim()) return;

        const newId = `PAYM${paymentMethods.length + 1}`;
        setPaymentMethods((prev) => [
            ...prev,
            { id: newId, nom: newName.trim(), descriptions: newDescription ? [newDescription.trim()] : [], selectedDescription: newDescription ? newDescription.trim() : null },
        ]);

        setNewName("");
        setNewDescription("");
        setIsAddingMethod(false);
    };

    return (
        <div className="order-delivery-cost-container border border-[#cccccc] shadow-sm rounded-md p-4">
            <h2 className="text-xl font-bold mb-3">Mode de paiement</h2>

            <div className="grid grid-cols-2 gap-4 mts">
                {paymentMethods.map((method) => (
                    <div key={method.id}>
                        {/* Checkbox */}
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="paymentMethod"       
                                value={method.id}
                                checked={selected === method.id}
                                onChange={() => setSelected(method.id)}
                                className="accent-[#14446c] cursor-pointer"
                            />
                            <span className="font-semibold">{method.nom}</span>
                        </label>

                        {/* Si coché → afficher select et input */}
                        {selected.includes(method.id) && (
                            <div className="flex flex-col gap-2 payment-method-select">
                                <input
                                    list={`desc-list-${method.id}`}
                                    value={method.selectedDescription || ""}
                                    onChange={(e) => handleSelectDescription(method.id, e.target.value)}
                                    className="border rounded w-full payment-method-input-p"
                                />
                                <datalist id={`desc-list-${method.id}`}>
                                    {method.descriptions.map((desc, index) => (
                                        <option key={index} value={desc} />
                                    ))}
                                </datalist>

                                {/* Ajouter une nouvelle description */}
                                {addingDescriptionFor === method.id ? (
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            placeholder="Nouvelle description"
                                            value={tempDescription}
                                            onChange={(e) => setTempDescription(e.target.value)}
                                            className="border rounded w-full payment-method-input-p"
                                        />
                                        <button
                                            onClick={() => handleSaveNewDescription(method.id)}
                                            className="text-[#f14446c] hover:text-[#f18c08] cursor-pointer"
                                            title="Ajouter"
                                        >
                                            <FaCheckSquare size={21} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAddingDescriptionFor(null);
                                                setTempDescription("");
                                            }}
                                            className="text-red-500 hover:text-red-800 cursor-pointer"
                                            title="Annuler"
                                        >
                                            <MdDisabledByDefault size={24} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setAddingDescriptionFor(method.id)}
                                        className="bg-[#14446c] text-white rounded w-max cursor-pointer hover:bg-[#14446cc0] add-new-desc-btn"
                                    >
                                        + Ajouter une nouvelle description
                                    </button>
                                )}
                            </div>
                        )}

                    </div>
                ))}

                {/* Ajout d'un nouveau mode de paiement */}
                {isAddingMethod ? (
                    <div className="border rounded-md bg-gray-50 flex flex-col gap-2 add-payment-method-container">
                        <input
                            type="text"
                            placeholder="Nom du mode de paiement"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border rounded payment-method-input-p"
                        />
                        <input
                            type="text"
                            placeholder="Première description (optionnel)"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="border rounded payment-method-input-p"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveNewPaymentMethod}
                                className="bg-[#14446c] text-white rounded hover:bg-[#f18c08] cursor-pointer payment-method-input-p"
                            >
                                Sauvegarder
                            </button>
                            <button
                                onClick={() => setIsAddingMethod(false)}
                                className="bg-red-500 text-white rounded hover:bg-red-800 cursor-pointer payment-method-input-p"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAddingMethod(true)}
                        className="text-[#f18c08] w-24 cursor-pointer hover:text-[#14446c]"
                        title="Ajouter un mode de paiement"
                    >
                        <MdAddBox size={28} />
                    </button>
                )}
            </div>
        </div>
    );
}
