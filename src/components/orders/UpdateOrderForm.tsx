'use client'

import '@/styles/form.css';
import '@/styles/order.css';
import { handleUpdateOrder } from '@/utils/handlers/handleUpdateOrder';
import OrderForm from './OrderForm';
import { UpdateOrderParams } from '@/utils/types/UpdateOrderParams';

export default function UpdateOrderForm() {
  const initialValues: Partial<UpdateOrderParams> = {
    idCommande: '',
    date: '',
    adresseLivraison: '',
    adresseFacturation: '',
    fraisDeLivraison: '',
    produits: [{ nom: '', prixUnitaire: '', quantite: '' }]
  };

  return (
    <div>
      <OrderForm
        onSubmit={handleUpdateOrder}
        mode="update"
        initialValues={initialValues}
      />
    </div>
  );
}
