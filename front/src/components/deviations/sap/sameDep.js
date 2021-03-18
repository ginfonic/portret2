import React, {useState} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse/Collapse";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export default React.memo(function (props) {
    const classes = useStyles();

    const {same_department} = props;

    const [openSameDep, setOpenSameDep] = useState(false);

    return <div>
        <ListItem
            divider
            button
            onClick={() => {
                setOpenSameDep(!openSameDep)
            }}
        >
            <ListItemText>
                Данное подразделение привязано к одному и тому же
                эталонному подразделению с другими подразделениями из этого банка:
            </ListItemText>
            <ListItemIcon>
                {openSameDep ? <ExpandLess/> : <ExpandMore/>}
            </ListItemIcon>
        </ListItem>

        <Collapse in={openSameDep} timeout={"auto"} unmountOnExit>
            <div className={classes.nested}>
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding={"default"} align={"left"}>
                                Банк
                            </TableCell>
                            <TableCell padding={"default"} align={"left"}>
                                Наименование подразделения
                            </TableCell>
                            <TableCell padding={"default"} align={"left"}>
                                Функциональный блок
                            </TableCell>
                            <TableCell padding={"default"} align={"left"}>
                                Уровень
                            </TableCell>
                            <TableCell padding={"default"} align={"center"}>
                                Название эталонного подразделения
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {same_department.map((row, index) =>
                            <TableRow key={index}>
                                <TableCell align={"left"}>
                                    {row.bank}
                                </TableCell>
                                <TableCell align={"left"}>
                                    <Link
                                        to={row.link}
                                        target="_blank"
                                    >
                                        {row.depname}
                                    </Link>
                                </TableCell>
                                <TableCell align={"left"}>
                                    {row.funcblock}
                                </TableCell>
                                <TableCell align={"left"}>
                                    {row.lvl}
                                </TableCell>
                                <TableCell>
                                    {row.etalon_name ? row.etalon_name : '-'}
                                </TableCell>
                            </TableRow>)}
                    </TableBody>
                </Table>
            </div>
        </Collapse>
    </div>
})