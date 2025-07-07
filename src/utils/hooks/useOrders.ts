import { useEffect, useState } from "react";
import axios from 'axios';
import { Order } from "../types/orderList";

export function useOrders() {
    const [data, setData] = useState<Order[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        axios.get(`${API_URL}/orders`).then((res) => setData(res.data));    
    }, []);
    
    return data;
}