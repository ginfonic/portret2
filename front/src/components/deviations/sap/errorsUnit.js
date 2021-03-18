import React, {useState} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Collapse from "@material-ui/core/Collapse";
import TableHead from "@material-ui/core/TableHead";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import UnitRow from './unitRow';

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
        position: 'relative'
    },

    buttonRight: {
        position: 'absolute',
        right: 5,
        top: 7,
    }
}));

export default React.memo(function (props) {
    const classes = useStyles();

    const {deviations, setDeviations} = props;

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
                В должностях этого подразделения присутствуют ошибки
            </ListItemText>
            <ListItemIcon>
                {openSameDep ? <ExpandLess/> : <ExpandMore/>}
            </ListItemIcon>
        </ListItem>

        <Collapse in={openSameDep} timeout={"auto"} unmountOnExit>
            <div className={classes.nested}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding={"default"} align={"left"}>
                                Должность
                            </TableCell>
                            <TableCell padding={"default"} align={"left"}>
                                Ошибка
                            </TableCell>
                            <TableCell padding={"default"} align={"left"}>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deviations.match_unit_err.map((unit, index) =>
                            <UnitRow deviations={deviations} setDeviations={setDeviations} unit={unit} index={index}/>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Collapse>
    </div>
})