import { handleSubmitOrder } from "@/utils/handlers/handleSubmitOrder";
import OrderForm from "./OrderForm";

export default function CreateOrderForm() {
    return <OrderForm onSubmit={handleSubmitOrder} title="Ajouter une commande"/>;
}