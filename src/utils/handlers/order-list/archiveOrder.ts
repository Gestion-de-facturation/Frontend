import axios from 'axios';

export async function archiveOrder(id: string, archive: boolean): Promise<void> {
    try {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/orders/order/${id}/softdelete`, {
            isDeleted: archive
        });
    } catch (err) {
        console.error("Erreur lors de l'archivage de la commande :", err);
        throw err;
    }
}
