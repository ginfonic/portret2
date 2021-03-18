import React from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import Typography from "@material-ui/core/Typography";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import {Delete} from "@material-ui/icons";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Switch from "@material-ui/core/Switch";
import Axios from "axios";

const filtered_matched = (matched) => {
    let unique_units = [];
    matched.map((elem) => {
        if (unique_units.filter((sub_elem) => sub_elem.sap.name === elem.sap.name).length === 0) unique_units.push(elem)
    });
    return unique_units
};

export default React.memo( function MatchedTable(props) {

    const {matched, chosen, height, select_structure, changed, setChanged} = props;
    const [sorted, setSorted] = React.useState(filtered_matched(matched));
    const [sort, setSort] = React.useState(true);

    const handleSort = () => {
        setSort(!sort)
    };
    React.useEffect(() => {
        if (sort) {
            setSorted(filtered_matched(matched));
        }
        else {
            setSorted(matched)
        }
    }, [sort, matched]);

    const handleDelete = (item) => () => {
        Axios.post('match/unmatch_units',
            {select_structure, matched_elem: item, matched: matched, sort: sort}).then((response) => {
            if (response.data.message === 'ok')
            {
                setChanged(!changed)
            }
        });
    };

    return <Card style={{height: height / 2.4}}>
        <CardHeader
            title={`Сматченные должности`}
            action={
                <Switch
                    color={"default"}
                    checked={sort}
                    onChange={handleSort}
                />
            }
            subheader={sort ? 'Только уникальные' : 'Все'}
        />
        <Divider/>
        <TableContainer style={{height: height / 3.1, overflow: 'auto'}}>
            <Table size={"small"}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">
                            <Typography variant={"h6"}>
                                Должность из типовой
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant={"h6"}>
                                Должность из SAP
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sorted.map((item) => {
                        return <TableRow key={item.sap.id}>
                            <TableCell align="center" >
                                {`${item.etalon.name}${!sort ? ` (${chosen.name})` : ``}`}
                            </TableCell>
                            <TableCell>
                                <IconButton size={"small"} onClick={handleDelete(item)}>
                                    <Delete/>
                                </IconButton>
                            </TableCell>
                            <TableCell align="center">
                                {`${item.sap.name}${!sort ? ` (${item.sap.sap_name})` : ``}`}
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        </Card>
})