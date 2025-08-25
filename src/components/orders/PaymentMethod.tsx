"use client"

import { useState, useEffect } from "react";
import { MdAddBox } from "react-icons/md";
import { FaCheckSquare } from "react-icons/fa";
import { MdDisabledByDefault } from "react-icons/md";
import { PaymentMethodType } from "@/utils/types/order-form/paymentMethod";
import { fetchPaymentMethods } from "@/utils/services/paymentMethodService";
import '@/styles/form.css';
import '@/styles/order.css';
import { buildExistingModePaiementPlayload, buildNewModePaiementPayload, ModePaiementPayload } from "@/utils/handlers/order-form/buildModePaiementPayload";

type Props = {
    onChange: (payload: ModePaiementPayload | null) => void;
}

export default function PaymentMethod({ onChange }: Props) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodType[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [selectedDescription, setSelectedDescription] = useState<string>("");

    const [isAddingMethod, setIsAddingMethod] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const [addingDescriptionFor, setAddingDescriptionFor] = useState<string | null>(null);
    const [tempDescription, setTempDescription] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPaymentMethods();
                setPaymentMethods(data);
            } catch (e) {
                console.error("Impossible de charger les modes de paiement", e);
            };
            load();
        }
    }, []);

    const handleSelectMethod = (id: string) => {
        setIsAddingMethod(false);
        setNewName(""),
            setNewDescription("");

        setSelectedId(id);
        setSelectedDescription("");

        const method = paymentMethods.find(m => m.id === id);
        if (method) {
            onChange(buildExistingModePaiementPlayload(method, ""));
        } else {
            onChange(null);
        }
    };

    const handleSaveNewDescription = () => {
        if (!addingDescriptionFor || !tempDescription.trim()) {
            setAddingDescriptionFor(null);
            setTempDescription("");
            return;
        }

        setPaymentMethods(prev =>
            prev.map(pm =>
                pm.id === addingDescriptionFor && !pm.descriptions.includes(tempDescription.trim())
                    ? { ...pm, descriptions: [...pm.descriptions, tempDescription.trim()] }
                    : pm
            )
        );

        if (selectedId === addingDescriptionFor) {
            setSelectedDescription(tempDescription.trim());
            const method = paymentMethods.find(m => m.id === addingDescriptionFor);
            if (method) {
                onChange(buildExistingModePaiementPlayload(method, tempDescription.trim()));
            }
        }
        setAddingDescriptionFor(null);
        setTempDescription("");
    };

    const startAddNewMethod = () => {
        setSelectedId("");
        setSelectedDescription("");
        setIsAddingMethod(true);
        onChange(null);
    };

    const handleSaveNewPaymentMethod = () => {
        if (!newName.trim()) return;
        const payload = buildNewModePaiementPayload(newName, newDescription, false);
        onChange(payload);
        setIsAddingMethod(false);
    };

    return (
        <div className="order-delivery-cost-container border border-[#cccccc] shadow-sm rounded-md p-4">
            <h2 className="text-xl font-bold">Mode de paiement</h2>

            <div className="grid grid-cols-2 gap-4 mts">
                {paymentMethods.map((method) => (
                    <div key={method.id}>
                        {/* Checkbox */}
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={selectedId === method.id}
                                onChange={() => setSelectedId(method.id)}
                                className="accent-[#14446c] cursor-pointer"
                            />
                            <span className="font-semibold">{method.nom}</span>
                        </label>

                        {/* Si coché → afficher select et input */}
                        {selectedId.includes(method.id) && (
                            <div className="flex flex-col gap-2 payment-method-select">
                                <input
                                    list={`desc-list-${method.id}`}
                                    value={selectedDescription}
                                    //onChange={(e) => handleSelectDescription(method.id, e.target.value)}
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
                                            //onClick={() => handleSaveNewDescription(method.id)}
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
                                //onClick={handleSaveNewPaymentMethod}
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
