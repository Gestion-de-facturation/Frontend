import axios from 'axios';

export const handleLogout = async () : Promise<void> => {
    try {
        localStorage.removeItem('isLoggedIn');

        await axios.post(`${process.env.NEXT_PUBLIC_URL}/auth/logout`, {}, {withCredentials: true});
    } catch (error) {
        console.error('Erreur lors de la déconnexion', error);
        throw error;
    }
};