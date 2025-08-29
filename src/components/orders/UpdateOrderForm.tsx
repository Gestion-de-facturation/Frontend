'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import OrderForm from './OrderForm';
import { UpdateOrderParams } from '@/utils/types/UpdateOrderParams';
import { ModePaiementPayload } from '@/utils/handlers/order-form/buildModePaiementPayload';
import { handleUpdateOrder } from '@/utils/handlers/handleUpdateOrder';
import '@/styles/form.css';
import '@/styles/order.css';

type Props = {
  commandeId: string | null;
};

export default function UpdateOrderForm({ commandeId }: Props) {
  const [initialValues, setInitialValues] = useState<Partial<UpdateOrderParams> | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: UpdateOrderParams) => {
    await handleUpdateOrder({
      ...data,
      setLoading,
      onSuccess: () => {
        router.push('/dashboard/invoices');
      },
    });
  };

  useEffect(() => {
    if (!commandeId) return;

    const fetchCommande = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${commandeId}`);
        const commande = res.data;

        // Récupération du mode de paiement existant
        let existingPayment: ModePaiementPayload | null = null;

        if (commande.paiements && commande.paiements.length > 0) {
          const firstPaiement = commande.paiements[0];

          existingPayment = {
            id: firstPaiement.mode.id,
            nom: firstPaiement.mode.nom,
            isActive: firstPaiement.mode.isActive,
            description: {
              contenu: firstPaiement.descriptionChoisie || firstPaiement.mode.description?.contenu || "",
            },
          };
        }

        setInitialValues({
          idCommande: commande.id,
          reference: commande.reference,
          date: commande.date,
          adresseLivraison: commande.adresse_livraison,
          adresseFacturation: commande.adresse_facturation,
          statutLivraison: commande.statut_livraison,
          statutPaiement: commande.statut_paiement,
          orderType: commande.order_type,
          echeance: commande.echeance,
          fraisDeLivraison: commande.frais_de_livraison?.toString() || '0',
          produits: commande.commandeProduits.map((p: any) => ({
            nom: p.produit.nom,
            prixUnitaire: p.produit.prixUnitaire.toString(),
            quantite: p.quantite.toString(),
          })),
          modePaiement: existingPayment,
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
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#ffffff71] bg-opacity-30 z-50">
          <div className="w-16 h-16 border-4 border-[#f18c08] border-t-transparent rounded-full animate-spin update-form-spin"></div>
        </div>
      )}
      <OrderForm
        onSubmit={handleSubmit}
        mode="update"
        initialValues={initialValues}
      />
    </div>

  );
}
