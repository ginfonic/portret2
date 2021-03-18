import React from "react"
import {Tooltip, Legend, PieChart, RadialBar, Pie} from "recharts";

export default React.memo(function (props) {
    const height = document.getElementById(`${props.n}_graph_container`).offsetHeight * (props.n.toString()[0] !== '4' ? 1.2 : 1);
    const width = document.getElementById(`${props.n}_graph_container`).offsetWidth;

    const style = {
        top: 0,
        left: width * 0.75,
        lineHeight: '24px'
    };

    return <PieChart
        width={width * 0.95}
        height={height * 0.7}
    >
        <Tooltip/>
        <Pie data={props.data}
             cx={height / 2}
             cy={height / 2  * 0.7}
             outerRadius={height / 4} label/>
        <Legend iconSize={10} width={120} height={140} layout={"vertical"} verticalAlign={"middle"} wrapperStyle={style}/>
    </PieChart>
})
