import React from "react";
import Axios from "axios";
import Table from "../tableTemplate";

export default React.memo(function (props) {
    const {select_structure} = props;

    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [filter, setFilter] = React.useState({
        'bank': '',
        'dep': '',
        'funcblock': '',
        'lvl': '',
        'etalon': ''
    });

    React.useEffect(() => {
        setLoading(true);
        Axios.post('deviation_errors/table', {select_structure, filter}).then((response) => {
            setRows(response.data.table);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        });
    }, [select_structure, filter]);

    return  <Table
        loading={loading}
        select_structure={select_structure}
        table={rows}
        setFilter={setFilter}
        id={'errors'}
    />
});