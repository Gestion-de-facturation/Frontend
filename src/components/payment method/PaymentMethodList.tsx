'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { LuArchiveX } from "react-icons/lu";
import { FiTrash } from "react-icons/fi";
import '@/styles/order.css';
import toast from "react-hot-toast";
import ConfirmModal from "../modals/ConfirmModal";

type PaymentMethod = {
    id: string;
    nom: string;
    isActive: boolean;
    descriptions: { id: string; contenu: string; idMode: string }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PaymentMethodList() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [openId, setOpenId] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const res = await axios.get(`${API_URL}/payments?isActive=true`);
                setMethods(res.data);
            } catch (error) {
                console.error("Erreur axios: ", error);
            }
        };

        fetchPaymentMethods();
    }, []);

    const toggleDescriptions = (id: string) => {
        setOpenId(openId === id ? null : id);
    }

    const handleDelete = async (id: string) => {
        try {
            await axios.patch(`${API_URL}/payments/payment/${id}`, {
                isActive: false
            });

            setMethods((prev) => prev.filter((m) => m.id !== id));
            setSelectedMethod(null);
            toast.success('Mode paiement ajouté à la corbeille');
        } catch (error) {
            console.error("Erreur lors de la suppression: ", error);
            toast.error("Erreur lors de la suppression du mode de paiement.")
        }
    }

    return (
        <div className="invoice-container border border-[#cccccc] pg rounded-lg shadow-lg w-[50%] payment-method-container">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">Liste des modes de paiement</h2>
                <button
                    className="flex gap-2 border border-[#cccccc] w-32 h-10 text-white rounded font-semibold bg-[#14446c] cursor-pointer add-order-btn hover:bg-[#f18c08]"
                    title="Ajoute un mode de paiement"
                >
                    <IoAdd size={24} /> Ajouter
                </button>
            </div>

            <div className="mts">
                {methods.map((method) => (
                    <div
                        key={method.id}
                        className={`flex justify-between rounded-md shadow-sm hover:shadow-md cursor-pointer mts payment-method-content
                                ${openId === method.id ? "bg-[#14446c] text-white" : "bg-[#ffffff71]"}`}
                    >
                        <div className="w-full">
                            <div className="flex justify-between items-center cursor-pointer w-full">
                                <h3 className='text-xl'>{method.nom}</h3>
                                <div className="flex gap-2 justify-between">
                                    <button
                                        onClick={() => toggleDescriptions(method.id)}
                                        className={`cursor-pointer hover:text-[#f18c08]`}
                                        title="Développer"
                                    >
                                        {openId === method.id ? (
                                            <IoIosArrowDropup size={24} className="hover:h-8 hover:w-8 text-[#f18c08]" />
                                        ) : (
                                            <IoIosArrowDropdown size={24} className="hover:h-8 hover:w-8" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setSelectedMethod(method)}
                                        title="Supprimer"
                                        className="cursor-pointer hover:text-[#f18c08]">
                                        <LuArchiveX
                                            size={23}
                                            className="hover:h-8 hover:w-8"
                                        />
                                    </button>
                                </div>
                            </div>

                            {openId === method.id && method.descriptions.length > 0 && (
                                <ul className="list-disc text-[#ffffff] payments-desc-list">
                                    {method.descriptions.map((desc) => (
                                        <>
                                            <li
                                                key={desc.id}
                                                className="flex gap-2"
                                            >
                                                {desc.contenu}
                                                <FiTrash size={20} color="red" className="hover:w-6 hover:h-6" />
                                            </li>
                                        </>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedMethod && (
                <ConfirmModal
                    title="Confirmation"
                    message={`Voulez-vous vraiment supprimer le mode paiement "${selectedMethod.nom}"`}
                    confirmBtn="Supprimer"
                    cancelBtn="Annuler"
                    onConfirm={() => handleDelete(selectedMethod.id)}
                    onCancel={() => setSelectedMethod(null)}
                />
            )}
        </div>
    )
}