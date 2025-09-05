'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LuArchiveX } from 'react-icons/lu';
import { FiTrash } from 'react-icons/fi';
import { TbPencil } from 'react-icons/tb';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/modals/ConfirmModal';
import '@/styles/order.css';
import { IoAdd } from 'react-icons/io5';
import { CreateCategoryForm } from './CreateCategoryForm';
import UpdateCategoryForm from './UpdateCategoryForm';

export type Category = {
    id: string;
    nom: string;
    isActive: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
    const [openId, setOpenId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories?isActive=true`);
                setCategories(res.data);
            } catch (error) {
                console.error('Error axios: ', error);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await axios.patch(`${API_URL}/categories/categorie/delete/soft/${id}`, {
                isActive: false
            });

            setCategories((prev) => prev.filter((m) => m.id !== id));
            setCategoryToDelete(null);
            toast.success('Catégorie ajoutée à la corbeille');
        } catch (error) {
            console.error("Erreur lors de la suppression: ", error);
            toast.error("Erreur lors de la suppression de la catégorie.")
        }
    }
    return (
        <div className="mts flex gap-6 invoice-container border border-[#cccccc] gap-2 pg w-[44%]  rounded-lg shadow-lg category-container">
            <div className="w-[40vw] min-w-[35vw]">
                <div className="flex gap-4">
                    <h2 className="text-2xl font-bold mts">
                        Catégories
                    </h2>
                    <button
                        onClick={() => setShowForm(true)}
                        title='Ajouter une catégorie'
                        className="flex gap-2 border border-[#cccccc] w-32 h-10 text-white rounded font-semibold bg-[#14446c] mts cursor-pointer add-order-btn hover:bg-[#f18c08]">
                        <IoAdd size={24} /> Ajouter
                    </button>
                </div>

                <div className='mts max-h-[90vh] overflow-y-auto'>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={`flex justify-between rounded-md shadow-sm hover:shadow-md cursor-pointer mts category-content
                        ${openId === category.id ? "bg-[#14446c] text-white" : "bg-[#ffffff71]"}`}
                        >
                            <div className="w-full">
                                <div className="flex justify-between items-center curor-pointer w-full">
                                    <h3 className='text-xl'>{category.nom}</h3>
                                    <div className="flex gap-2 justify-between">
                                        <button
                                            onClick={() => {
                                                setCategoryToEdit(category);
                                                setEditId(category.id);
                                                setShowUpdateForm(true);
                                            }}
                                            className={`cursor-pointer hover:text-[#f18c08] ${editId === category.id && showUpdateForm === true ? "text-[#f18c08]" : ""}`}
                                        >
                                            <TbPencil size={23} className='hover:h-8 hover:w-8' />
                                        </button>
                                        <button
                                            onClick={() => setCategoryToDelete(category)}
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

                {categoryToDelete && (
                    <ConfirmModal
                        title='Confirmation'
                        message={`Voulez-vous vraiment supprimer la catégorie "${categoryToDelete.nom}"`}
                        confirmBtn='Supprimer'
                        cancelBtn='Annuler'
                        onConfirm={() => handleDelete(categoryToDelete.id)}
                        onCancel={() => setCategoryToDelete(null)}
                    />
                )}
            </div>

            <div>
                {showForm && (
                    <CreateCategoryForm
                        onClose={() => setShowForm(false)}
                        onAdd={(newCategory) => setCategories((prev) => [...prev, newCategory])}
                    />
                )}
                {showUpdateForm && categoryToEdit && (
                    <UpdateCategoryForm
                        category={categoryToEdit}
                        onClose={() => {
                            setShowUpdateForm(false);
                            setSelectedCategory(null);
                        }}
                        onUpdate={(updatedCategory) => {
                            setCategories((prev) =>
                                prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
                            )
                        }}
                    />
                )}
            </div>
        </div>
    );
} 