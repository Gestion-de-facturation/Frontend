import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';


import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdAdd,  MdRemoveCircleOutline } from 'react-icons/md';
import '@/styles/order.css';
import toast from 'react-hot-toast';

type Produit = {
    id: string;
    nom: string;
    prixUnitaire: number;
    fournisseur: string;
    categorie: string;
}

type ProduitCommande = {
    idProduit: string;
    nom: string;
    quantite: number;
    prixUnitaire: number;
}

export default function ProductsList() {
    const [data, setData] = useState<Produit[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [produitsCommandes, setProduitsCommandes] = useState<ProduitCommande[]>([]);
    const [adresseLivraison, setAdresseLivraison] = useState('');
    const [adresseFacturation, setAdresseFacturation] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5, 
        });
    const API_URL = process.env.NEXT_PUBLIC_API_URL;


    useEffect(() => {
        axios.get(`${API_URL}/products`).then((res) => {
            setData(res.data);
        });
    }, []);

    const addProduct = (produit: Produit) => {
        const exist = produitsCommandes.find(p => p.idProduit === produit.id);

        if (exist) {
            toast.error(`${produit.nom} est déjà ajouté`);
            return;
        }

        const quantite = parseInt(prompt(`Quantité pour ${produit.nom}`) || '1', 10);

        if (isNaN(quantite) || quantite <= 0) {
            toast.error("Quantité invalide");
            return;
        }

        setProduitsCommandes(prev => [
            ...prev,
            {
            idProduit: produit.id,
            nom: produit.nom,
            quantite,
            prixUnitaire: produit.prixUnitaire,
            },
        ]);

        toast.success(`${quantite} ${produit.nom} ajouté à la commande`, {
            duration: 3000,
            icon: "✅",
        });
    };

    const removeProduct = (idProduit: string) => {
        setProduitsCommandes(prev=> prev.filter(p => p.idProduit !== idProduit));
    };

    const order = async () => {
        if(!adresseLivraison || !adresseFacturation || produitsCommandes.length === 0) {
            alert('Veuillez remplir toutes les informations nécessaires et ajouter au moins un produit');
            return;
        }

        try {
            const body = {
                adresse_livraison : adresseLivraison,
                adresse_facturation : adresseFacturation,
                date: new Date().toISOString(),
                produits: produitsCommandes.map(p => ({
                    idProduit: p.idProduit,
                    quantite: p.quantite
                }))
            };

            const res = await axios.post(`${API_URL}/orders/order`, body);
            alert('Commande passée avec succès !' + res.data.id);

            setProduitsCommandes([]);
            setAdresseLivraison('');
            setAdresseFacturation('');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la commande. Veuillez réessayer.');
        }
    }



    const columns: ColumnDef<Produit>[] = [
        {
            header: 'Référence',
            accessorKey: 'id',
        },
        {
            header: 'Nom',
            accessorKey: 'nom',
        },
        {
            header: 'Prix Unitaire (AR)',
            accessorKey: 'prixUnitaire',
        },
        {
            header: 'Fournisseur',
            accessorKey: 'fournisseur.nom',
        },
        {
            header: 'Catégorie',
            accessorKey: 'categorie.nom',
        },
        {
            header: 'Action',
            cell: ({row}) => (
                <button onClick={() => addProduct(row.original)} className='cursor-pointer ml-8 addBtn' title='Ajouter à la commande'>
                    <MdAdd className="w-4 h-4 text-[#f18c08] addIcon"/>
                </button>
            )       
        }
    ];  

    const table = useReactTable({
        data, 
        columns,
        state: {
            globalFilter,
            pagination
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
    });

    return (
        <div className='p-6 max-w-5xl order'>
            <h2 className="text-2xl font-bold mb-4 place-self-center">Ajouter une commande</h2>

            <div className='grid grid-cols-2 gap-4 mts'>
                <textarea
                className="border p-2 rounded input-padding"
                placeholder="Adresse de livraison"
                value={adresseLivraison}
                onChange={ e => setAdresseLivraison(e.target.value) }
                />
                <textarea
                className="border p-2 rounded input-padding"
                placeholder="Adresse de facturation"
                value={adresseFacturation}
                onChange={ e => setAdresseFacturation(e.target.value) }
                />
            </div>

            <div className="mb-6 mts">
                <h3 className="font-semibold mb-2">Produits sélectionnés</h3>
                {produitsCommandes.length===0 && <p className='text-gray-500'>Aucun produit ajouté</p>}
                <ul className="mb-4 border rounded p-4 bg-gray-100 shadow">
                    {produitsCommandes.map((produit) => (
                        <li
                        key={produit.idProduit}
                        className="grid grid-cols-3 gap-4 items-center border-b py-2"
                        >
                        <div>
                            <p className="font-medium">{produit.nom}</p>
                            <p className="text-sm text-gray-600">
                            {produit.quantite} × {produit.prixUnitaire.toLocaleString()} Ar
                            </p>
                        </div>
                        <p className="font-semibold">
                            {(produit.quantite * produit.prixUnitaire).toLocaleString()} Ar
                        </p>
                        <button onClick={() => removeProduct(produit.idProduit)} className='flex justify-evenly cursor-pointer text-center text-red-600 hover:text-red-800'>
                             Supprimer
                        </button>
                        </li>
                    ))}
                    </ul>
                    <div className="text-right font-bold text-lg">
                        Total :{" "}
                        {produitsCommandes
                            .reduce((acc, p) => acc + p.quantite * p.prixUnitaire, 0)
                            .toLocaleString()}{" "}
                        Ar
                    </div>


            </div>


            <button
                onClick={order}
                className="bg-[#f18c08] text-white text-lg  rounded-md w-36 h-12 mts cursor-pointer"
            >
                Commander
            </button>

            <h2 className="text-2xl font-bold mb-4 place-self-center mts">Liste des produits</h2>

            <input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="border border-gray-300 h-8 mb-4 w-full rounded mts product-search-input"
            />

            <table className='border w-full mts'>
                    <thead className='bg-gray'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className='p-2 border'>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className='p-2 border'>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>

        </div>
    );
}