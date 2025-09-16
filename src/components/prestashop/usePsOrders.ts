import { useEffect, useState } from "react";
import axios from 'axios';
import { PsOrder } from "./PsOrder";

export function usePsOrders() {
    const [data, setData] = useState<PsOrder[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        axios.get(`${API_URL}/prestashop/psOrders`).then((res) => setData(res.data));
    }, []);

    return data;
}