import useSWR from 'swr';
import axios from 'axios';

const fetchOrders = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/prestashop/psOrders`);
    return res.data;
};

export function usePsOrdersSwr() {
    const { data, isLoading, mutate } = useSWR('/prestashop/psOrders', fetchOrders);
    return { data, isLoading, mutate };
}