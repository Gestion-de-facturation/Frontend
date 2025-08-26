"use client";

import { useState, useEffect } from "react";
import { MdAddBox } from "react-icons/md";
import { FaCheckSquare } from "react-icons/fa";
import { MdDisabledByDefault } from "react-icons/md";
import '@/styles/form.css';
import '@/styles/order.css';
import { fetchPaymentMethods, createPaymentMethod, updateDescription } from "@/utils/services/paymentMethodService";

interface Description {
    id: string;
    contenu: string;
}

interface PaymentMethodType {
    id: string;
    nom: string;
    isActive: boolean;
    descriptions: Description[];
    selectedDescription?: string | null;
}

export default function PaymentMethod() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodType[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<string>("");
    const [addingDescriptionFor, setAddingDescriptionFor] = useState<string | null>(null);
    const [tempDescription, setTempDescription] = useState("");
    const [isAddingMethod, setIsAddingMethod] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    // Charger toutes les méthodes de paiement
    useEffect(() => {
        const loadPaymentMethods = async () => {
            try {
                const data: PaymentMethodType[] = await fetchPaymentMethods();
                const formatted = data.map(pm => ({ ...pm, selectedDescription: null }));
                setPaymentMethods(formatted);
            } catch (error) {
                console.error("Erreur lors du chargement des modes de paiement", error);
            }
        };
        loadPaymentMethods();
    }, []);

    // Sélection d'une description pour une méthode
    const handleSelectDescription = (methodId: string, descValue: string) => {
        setPaymentMethods(prev =>
            prev.map(pm =>
                pm.id === methodId ? { ...pm, selectedDescription: descValue } : pm
            )
        );
    };

    const handleSaveNewDescription = async (methodId: string, newContent: string) => {
        const method = paymentMethods.find(m => m.id === methodId);
        if (!method) return;

        try {
            // Créer un nouveau tableau de descriptions
            const updatedDescriptions = [
                ...method.descriptions, // toutes les descriptions existantes
                { contenu: newContent } // la nouvelle
            ];

            // Appel API pour mettre à jour le mode de paiement
            const updatedMethod = await updateDescription(
                methodId,
                method.nom,
                method.isActive,
                updatedDescriptions
            );

            // Mettre à jour l'état local
            setPaymentMethods(prev =>
                prev.map(m =>
                    m.id === methodId
                        ? {
                            ...updatedMethod,
                            selectedDescription: newContent // sélectionner la nouvelle description
                        }
                        : m
                )
            );

            // Vider le champ input et fermer le formulaire d'ajout
            setTempDescription("");
            setAddingDescriptionFor(null);

        } catch (error) {
            console.error("Erreur lors de l'ajout de la description :", error);
        }
    };



    // Ajouter un nouveau mode de paiement
    const handleSaveNewPaymentMethod = async () => {
        if (!newName.trim()) return;

        try {
            const newMethod = await createPaymentMethod(newName, newDescription ? [{ contenu: newDescription }] : []); // <-- Ici
            setPaymentMethods(prev => [...prev, { ...newMethod, selectedDescription: null }]);
            setNewName("");
            setNewDescription("");
            setIsAddingMethod(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout du mode de paiement:", error);
        }
    };


    return (
        <div className="order-delivery-cost-container border border-[#cccccc] shadow-sm rounded-md p-4">
            <h2 className="text-xl font-bold mb-3">Mode de paiement</h2>

            <div className="grid grid-cols-2 gap-4 mts">
                {paymentMethods.map(method => (
                    <div key={method.id}>
                        {/* Checkbox */}
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={selectedMethod === method.id}
                                onChange={() => setSelectedMethod(method.id)}
                                className="accent-[#14446c] cursor-pointer"
                            />
                            <span className="font-semibold">{method.nom}</span>
                        </label>

                        {/* Si coché → afficher select et input */}
                        {selectedMethod === method.id && (
                            <div className="flex flex-col gap-2 payment-method-select">
                                <input
                                    list={`desc-list-${method.id}`}
                                    value={method.selectedDescription || ""}
                                    onChange={e => handleSelectDescription(method.id, e.target.value)}
                                    className="border rounded w-full payment-method-input-p"
                                    placeholder="Sélectionnez ou saisissez une description"
                                />
                                <datalist id={`desc-list-${method.id}`}>
                                    {method.descriptions.map((desc, index) => (
                                        <option key={`${method.id}-${index}`} value={desc.contenu} />
                                    ))}
                                </datalist>

                                {/* Ajouter une nouvelle description */}
                                {addingDescriptionFor === method.id ? (
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            placeholder="Nouvelle description"
                                            value={tempDescription}
                                            onChange={e => setTempDescription(e.target.value)}
                                            className="border rounded w-full payment-method-input-p"
                                        />
                                        <button
                                            onClick={() => handleSaveNewDescription(method.id, tempDescription)}
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

                {/* Ajouter un nouveau mode de paiement */}
                {isAddingMethod ? (
                    <div className="border rounded-md bg-gray-50 flex flex-col gap-2 add-payment-method-container">
                        <input
                            type="text"
                            placeholder="Nom du mode de paiement"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            className="border rounded payment-method-input-p"
                        />
                        <input
                            type="text"
                            placeholder="Première description (optionnel)"
                            value={newDescription}
                            onChange={e => setNewDescription(e.target.value)}
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
