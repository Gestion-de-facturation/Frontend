'use client'

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import '@/styles/stats.css'

export const LineChartsRevenue = () => {
    const data = [{name: 'Jun', revenue: 100, pv: 2400, amt: 2400},
    {name: 'Jul', revenue: 100, pv: 2400, amt: 2400},
    {name: 'Aug', revenue: 200, pv: 2400, amt: 2400},
    {name: 'Sept', revenue: 150, pv: 2400, amt: 2400},
    {name: 'Oct', revenue: 350, pv: 2400, amt: 2400},
    {name: 'Nov', revenue: 400, pv: 2400, amt: 2400}
];

    return (
        <div className='border border-[#cccccc] rounded-md shadow-md hover:shadow-xl line-chart-container'>
            <h2 className='font-bold text-xl'>Revenue par mois</h2>
            <LineChart 
            width={600} 
            height={300} 
            data={data} 
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            className='mts'
            >
                <CartesianGrid stroke='none'/>
                <Line type="monotone" dataKey="revenue" stroke="#14446c" strokeWidth={2} />
                <XAxis dataKey="name" />
                <YAxis width="auto" label={{ value: 'Revenue', position: 'insideLeft', angle: -90 }} />
                <Legend align="right" />
            </LineChart>
        </div>
    );
}