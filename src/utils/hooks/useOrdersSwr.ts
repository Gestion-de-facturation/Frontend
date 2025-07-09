import useSWR from 'swr';
import axios from 'axios';

const fetchOrders = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
    return res.data;
};

export function useOrdersSwr() {
    const { data, isLoading, mutate } = useSWR('/orders', fetchOrders);
    return { data, isLoading, mutate };
}