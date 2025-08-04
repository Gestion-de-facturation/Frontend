export const displayStatut = (statut: string) => {
    let statut_bg_color : string;
    let statut_title: string = statut;
    if(statut === 'en_cours' || statut === 'en_attente') {
        if(statut === 'en_cours') {
        statut_title = 'en cours de livraison';
        } else {
        statut_title = 'en attente de paiement';
        }
        statut_bg_color = 'bg-blue-500';
    }  else if (statut === 'livré' || statut === 'validé') {
        if(statut === 'validé') {
        statut_title = 'paiement validé';
        }
        statut_bg_color = 'bg-green-600';
    } else if (statut === 'annulé') {
        statut_bg_color = 'bg-red-600';
    } else {
        statut_bg_color = 'bg-orange-500';
    }

    return {statut_bg_color, statut_title}
}