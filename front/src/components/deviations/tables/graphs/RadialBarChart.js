import React from "react"
import {Tooltip, Legend, RadialBarChart, RadialBar, PieChart} from "recharts";

export default React.memo(function (props) {
    const style = {
        top: 0,
        left: document.getElementById(`${props.n}_graph_container`).offsetWidth * 0.75,
        lineHeight: '24px'
    };

    return <RadialBarChart
        width={document.getElementById(`${props.n}_graph_container`).offsetWidth * 9.95}
        height={document.getElementById(`${props.n}_graph_container`).offsetHeight * 0.7}
        cx={document.getElementById(`${props.n}_graph_container`).offsetHeight / 2 * 0.9}
        cy={document.getElementById(`${props.n}_graph_container`).offsetHeight / 2 * 0.7}
        innerRadius={document.getElementById(`${props.n}_graph_container`).offsetHeight / 10 * 0.7}
        barSize={document.getElementById(`${props.n}_graph_container`).offsetHeight / 20 * 0.9}
        data={props.data}
    >
        <Tooltip/>
        <RadialBar minAngle={document.getElementById(`${props.n}_graph_container`).offsetHeight /20 * 0.9} label={{position: 'insideStart', fill: '#fff'}} background clockWise={true} dataKey={'value'}/>
        <Legend iconSize={20} width={120} height={140} layout={"vertical"} verticalAlign={"middle"} wrapperStyle={style}/>
    </RadialBarChart>
})
