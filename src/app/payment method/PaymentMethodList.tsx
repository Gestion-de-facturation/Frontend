'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { LuArchiveX } from "react-icons/lu";
import { FiTrash } from "react-icons/fi";
import { TbPencil } from "react-icons/tb";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/modals/ConfirmModal";
import CreatePaymentMethodForm from "./CreatePaymentMethodForm";
import '@/styles/order.css';
import UpdatePaymentMethod from "./UpdatePaymentMethod";

type PaymentMethod = {
    id: string;
    nom: string;
    isActive: boolean;
    descriptions: { id: string; contenu: string; idMode: string }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PaymentMethodList() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(null);
    const [methodToEdit, setMethodToEdit] = useState<PaymentMethod | null>(null);
    const [openId, setOpenId] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState<{ id: string; contenu: string; idMode: string } | null>(null);
    const [editId, setEditId] = useState<string | null>(null);

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
            setMethodToDelete(null);
            toast.success('Mode paiement ajouté à la corbeille');
        } catch (error) {
            console.error("Erreur lors de la suppression: ", error);
            toast.error("Erreur lors de la suppression du mode de paiement.")
        }
    }

    const handleDeleteDescription = async () => {
        if (!selectedDescription) return;
        try {
            await axios.delete(`${API_URL}/payments/payment/desc/${selectedDescription.idMode}`);
            toast.success("Description supprimée.");

            setMethods((prev) =>
                prev.map((m) =>
                    m.id === selectedDescription.idMode
                        ? { ...m, descriptions: m.descriptions.filter((d) => d.id !== selectedDescription.id) }
                        : m)
            );

            setSelectedDescription(null);
        } catch (error) {
            console.error("Erreur lors de la suppression de la description: ", error);
            toast.error("Erreur lors de la suppression");
        }
    }

    return (
        <div className="flex gap-6 invoice-container border border-[#cccccc] gap-2 pg w-[44%]  rounded-lg shadow-lg payment-method-container">
            <div className="w-[40vw] min-w-[35vw]">
                <div className="flex gap-4">
                    <h2 className="text-2xl font-bold">Liste des modes de paiement</h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex gap-2 border border-[#cccccc] w-32 h-10 text-white rounded font-semibold bg-[#14446c] cursor-pointer add-order-btn hover:bg-[#f18c08]"
                        title="Ajouter un mode de paiement"
                    >
                        <IoAdd size={24} /> Ajouter
                    </button>
                </div>

                <div className="mts  max-h-[90vh] overflow-y-auto">
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
                                            onClick={() => {
                                                setMethodToEdit(method);
                                                setEditId(method.id);
                                                setShowUpdateForm(true);
                                            }}
                                            className={`cursor-pointer hover:text-[#f18c08]  ${editId === method.id && showUpdateForm === true ? "text-[#f18c08]" : ""}`}
                                        >
                                            <TbPencil size={23} className="hover:h-8 hover:w-8" />
                                        </button>
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
                                            onClick={() => setMethodToDelete(method)}
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
                                                    <FiTrash
                                                        onClick={() => setSelectedDescription(desc)}
                                                        size={20}
                                                        color="red"
                                                        className="hover:w-6 hover:h-6" />
                                                </li>
                                            </>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {methodToDelete && (
                    <ConfirmModal
                        title="Confirmation"
                        message={`Voulez-vous vraiment supprimer le mode paiement "${methodToDelete.nom}"`}
                        confirmBtn="Supprimer"
                        cancelBtn="Annuler"
                        onConfirm={() => handleDelete(methodToDelete.id)}
                        onCancel={() => setMethodToDelete(null)}
                    />
                )}
                {selectedDescription && (
                    <ConfirmModal
                        title="Confirmation"
                        message={`Voulez-vous vraiment supprimer la description: "${selectedDescription.contenu}"?`}
                        confirmBtn="Supprimer"
                        cancelBtn="Annuler"
                        onConfirm={handleDeleteDescription}
                        onCancel={() => setSelectedDescription(null)}
                    />
                )}
            </div>

            <div>
                {showForm && (
                    <CreatePaymentMethodForm
                        onClose={() => setShowForm(false)}
                        onAdd={(newMethod) => setMethods((prev) => [...prev, newMethod])}
                    />
                )}
                {showUpdateForm && methodToEdit && (
                    <UpdatePaymentMethod
                        method={methodToEdit}
                        onClose={() => {
                            setShowUpdateForm(false)
                            setSelectedMethod(null);
                        }}
                        onUpdate={(updatedMethod) => {
                            setMethods((prev) =>
                                prev.map((m) => (m.id === updatedMethod.id ? updatedMethod : m)))
                        }}
                    />
                )}
            </div>
        </div>
    )
}