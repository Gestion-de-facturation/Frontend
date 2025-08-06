const setAdresseLivraison = (val: string) => {}
const setAdresseFacturation = (val: string) => {}
const setFraisDeLivraison = (val: string) => {}
const setIdCommande = (val: string) => {}
const setDate = (val: string) => {}

export const resetChampsAdresseModification = () => {
    setAdresseLivraison('');
    setAdresseFacturation('');
    setFraisDeLivraison('');
    setIdCommande('');
    setDate('');
  };