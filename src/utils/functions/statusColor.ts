export function statusColor(value: string) {
    let color;
    if(value == 'en_cours' || value == 'en_attente') {
        if (value == 'en_cours') {
            value = 'en cours'
        } else {
            value ='en attente';
        }
        color = 'text-blue-500'
    } else if (value == 'livré' || value == 'validé') {
        color = 'text-green-600';
    } else if (value == 'annulé') {
        color = 'text-red-600';
    } else {
        color = 'text-orange-500'
    }

    return {value, color};
}