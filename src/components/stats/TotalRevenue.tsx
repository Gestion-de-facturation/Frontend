import StatsCard from "./StatsCard";

import { GiReceiveMoney } from "react-icons/gi";

export default function TotalRevenue () {
    return (
        <StatsCard title={"Revenue totale"} 
        icon={<GiReceiveMoney size={20}/>} 
        content={"2.000.000 Ar"} 
        percentage={"+10.03"} />
    )
}