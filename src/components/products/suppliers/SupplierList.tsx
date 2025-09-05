'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LuArchiveX } from 'react-icons/lu';
import { TbPencil } from 'react-icons/tb';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/modals/ConfirmModal';
import '@/styles/order.css';
import { IoAdd } from 'react-icons/io5';
import { CreateSupplierForm } from './CreateSupplierForm';
import UpdateSupplierForm from './UpdateSupplierForm';

export type Supplier = {
    id: string;
    nom: string;
    isActive: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SupplierList() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
    const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
    const [openId, setOpenId] = useState<string | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await axios.get(`${API_URL}/suppliers?isActive=true`);
                setSuppliers(res.data);
            } catch (error) {
                console.error('Error axios: ', error);
            }
        };

        fetchSuppliers();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await axios.patch(`${API_URL}/suppliers/supplier/delete/soft/${id}`, {
                isActive: false
            });

            setSuppliers((prev) => prev.filter((m) => m.id !== id));
            setSupplierToDelete(null);
            toast.success('Fournisseur ajouté à la corbeille');
        } catch (error) {
            console.error("Erreur lors de la suppression: ", error);
            toast.error("Erreur lors de la suppression du fournisseur.")
        }
    }
    return (
        <div className="mts flex gap-6 invoice-container border border-[#cccccc] gap-2 pg w-[44%]  rounded-lg shadow-lg supplier-container">
            <div className="w-[40vw] min-w-[35vw]">
                <div className="flex justify-between gap-4">
                    <h2 className="text-2xl font-bold mts">
                        Fournisseurs
                    </h2>
                    <button
                        onClick={() => setShowForm(true)}
                        title='Ajouter un fournisseur'
                        className="flex gap-2 border border-[#cccccc] w-32 h-10 text-white rounded font-semibold bg-[#14446c] mts cursor-pointer add-order-btn hover:bg-[#f18c08]">
                        <IoAdd size={24} /> Ajouter
                    </button>
                </div>

                <div className='mts max-h-[90vh] overflow-y-auto'>
                    {suppliers.map((supplier) => (
                        <div
                            key={supplier.id}
                            className={`flex justify-between rounded-md shadow-sm hover:shadow-md cursor-pointer mts supplier-content
                        ${openId === supplier.id ? "bg-[#14446c] text-white" : "bg-[#ffffff71]"}`}
                        >
                            <div className="w-full">
                                <div className="flex justify-between items-center curor-pointer w-full">
                                    <h3 className='text-xl'>{supplier.nom}</h3>
                                    <div className="flex gap-2 justify-between">
                                        <button
                                            onClick={() => {
                                                setSupplierToEdit(supplier);
                                                setEditId(supplier.id);
                                                setShowUpdateForm(true);
                                            }}
                                            className={`cursor-pointer hover:text-[#f18c08] ${editId === supplier.id && showUpdateForm === true ? "text-[#f18c08]" : ""}`}
                                        >
                                            <TbPencil size={23} className='hover:h-8 hover:w-8' />
                                        </button>
                                        <button
                                            onClick={() => setSupplierToDelete(supplier)}
                                            title='Supprimer'
                                            className='cursor-pointer hover:text-[#f18c08]'
                                        >
                                            <LuArchiveX
                                                size={23}
                                                className='hover:h-8 hover:w-8'
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {supplierToDelete && (
                    <ConfirmModal
                        title='Confirmation'
                        message={`Voulez-vous vraiment supprimer le fournisseur "${supplierToDelete.nom}"`}
                        confirmBtn='Supprimer'
                        cancelBtn='Annuler'
                        onConfirm={() => handleDelete(supplierToDelete.id)}
                        onCancel={() => setSupplierToDelete(null)}
                    />
                )}
            </div>

            <div>
                {showForm && (
                    <CreateSupplierForm
                        onClose={() => setShowForm(false)}
                        onAdd={(newSupplier) => setSuppliers((prev) => [...prev, newSupplier])}
                    />
                )}
                {showUpdateForm && supplierToEdit && (
                    <UpdateSupplierForm
                        category={supplierToEdit}
                        onClose={() => {
                            setShowUpdateForm(false);
                            setSelectedSupplier(null);
                        }}
                        onUpdate={(updatedSupplier) => {
                            setSuppliers((prev) =>
                                prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s))
                            )
                        }}
                    />
                )}
            </div>
        </div>
    );
} 