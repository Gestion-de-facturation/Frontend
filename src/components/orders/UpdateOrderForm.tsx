'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleUpdateOrder } from '@/utils/handlers/handleUpdateOrder';
import OrderForm from './OrderForm';
import { UpdateOrderParams } from '@/utils/types/UpdateOrderParams';
import '@/styles/form.css';
import '@/styles/order.css';
import axios from 'axios';

type Props = {
  commandeId: string | null;
}

export default function UpdateOrderForm({ commandeId } : Props) {
  const [initialValues, setInitialValues] = useState<Partial<UpdateOrderParams> | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: UpdateOrderParams) => {
    await handleUpdateOrder({
      ...data,
      onSuccess: () => {
        router.push('/dashboard/invoices');
      }
    });
  };

  useEffect(() => {
    if (!commandeId) return;

    const fetchCommande = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${commandeId}`);
        const commande = res.data;

        // Mise en forme selon la structure attendue par le formulaire
        setInitialValues({
          idCommande: commande.id,
          date: commande.date,
          adresseLivraison: commande.adresse_livraison,
          adresseFacturation: commande.adresse_facturation,
          statutLivraison: commande.statut_livraison,
          statutPaiement: commande.statut_paiement,
          orderType: commande.order_type,
          fraisDeLivraison: commande.frais_de_livraison.toString(),
          produits: commande.commandeProduits.map((p: any) => ({
            nom: p.produit.nom,
            prixUnitaire: p.produit.prixUnitaire.toString(),
            quantite: p.quantite.toString(),
          })),
        });
      } catch (error) {
        console.error('Erreur lors du chargement de la commande :', error);
      }
    };

    fetchCommande();
  }, [commandeId]);

  if (!initialValues) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div>
      <OrderForm
        onSubmit={handleSubmit}
        mode="update"
        initialValues={initialValues}
      />
    </div>
  );
}
