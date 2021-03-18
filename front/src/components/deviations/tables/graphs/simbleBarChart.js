import React from "react"
import {Bar, BarChart, YAxis, XAxis, Tooltip, Legend, CartesianGrid, Brush, LabelList} from "recharts";

export default React.memo(function (props) {
    return <BarChart
        width={document.getElementById(`${props.n}_graph_container`).offsetWidth * 0.95}
        height={document.getElementById(`${props.n}_graph_container`).offsetHeight * 0.7 * (props.n.toString()[0] !== '4' ? 1.2 : 1)}
        data={props.data}
        margin={{top: 5, right: 30, left: 30, bottom: 5}}
    >
        <CartesianGrid strokeDasharray={"3 3"}/>
        <XAxis dataKey={"name"}/>
        <YAxis domain={[0, dataMax => {
            return Math.round(dataMax + (dataMax > 10 ? dataMax / 10 : 1))
        }]}/>
        <Tooltip/>
        <Bar dataKey={"value"}>
            <LabelList position="top" dataKey="value"/>
        </Bar>
        <Brush datakey={"name"} height={30}/>
    </BarChart>
})
