import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 700,
    },

    cardHeader: {
        padding: theme.spacing(1, 2),
    },
}));

export default React.memo(function Info(props) {
    const classes = useStyles();

    const {item, height, width} = props;
    
    return <Card style={{height: height / 2 - 76}}>
            <CardHeader
                className={classes.cardHeader}
                title="Информация"
            />
            <Divider/>
            <TableContainer
                            style={{maxWidth: document.getElementById('info_and_connections').offsetWidth,
                                maxHeight: height / 2 - 80 - 56}}
            >
                <Table aria-label="sap_elem_info" size={"small"}>
                    <TableBody>
                        <TableRow key="name">
                            <TableCell align="left">Наименование</TableCell>
                            <TableCell align="right">{item.name}</TableCell>
                        </TableRow>
                        <TableRow key="lvl">
                            <TableCell align="left">Уровень</TableCell>
                            <TableCell align="right">{item.lvl}</TableCell>
                        </TableRow>
                        <TableRow key="funcblock">
                            <TableCell align="left">Функциональный блок</TableCell>
                            <TableCell align="right">{item.funcblock}</TableCell>
                        </TableRow>
                        <TableRow key="parent">
                            <TableCell align="left">Родительское подразделение</TableCell>
                            <TableCell align="right">{item.parent ? item.parent.name : '-'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
})