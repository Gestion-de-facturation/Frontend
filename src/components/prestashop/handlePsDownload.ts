export const handlePsDownload = async (orderId: number) => {
  try {
    const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prestashop/psOrders/${orderId}`);
    if (!orderRes.ok) throw new Error("Impossible de récupérer la commande");

    const orderData = await orderRes.json();

    const invoiceNamePart = orderData.invoice?.number || orderData.invoiceId || orderId;

    const pdfRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prestashop/invoices/${orderId}/download`);
    if (!pdfRes.ok) throw new Error("Erreur lors du téléchargement du PDF");

    const blob = await pdfRes.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `facture#${invoiceNamePart}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

  } catch (err) {
    console.error("Erreur de téléchargement: ", err);
  }
};
