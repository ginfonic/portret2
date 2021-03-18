import React, {useState} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse";
import TableRow from "@material-ui/core/TableRow";
import ErrorDialog from "../../match/sap_list/error_dialog";
import Button from "@material-ui/core/Button";

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

    const {deviations, setDeviations, id} = props;

    const [openSameDep, setOpenSameDep] = useState(false);
    const [errorForm, setErrorForm] = React.useState(false);

    const setItemErrors = (errors) => {
        let new_dev = {...deviations};
        new_dev.match_err = errors;
        setDeviations(new_dev);
    };

    return <div>
        <ListItem
            divider
            button
            onClick={() => {
                setOpenSameDep(!openSameDep)
            }}
        >
            <ListItemText>
                В данном подразделении присутствуют ошибки матчинга.
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
                                Название
                            </TableCell>
                            <TableCell padding={"default"} align={"left"}>
                                Описание
                            </TableCell>
                        </TableRow>
                        <Button onClick={() => setErrorForm(true)} className={classes.buttonRight} variant={"outlined"}>
                            Редактор ошибок
                        </Button>
                    </TableHead>
                    <TableBody>
                        {deviations.match_err.map((row, index) =>
                            <TableRow key={index}>
                                <TableCell align={"left"}>
                                    {row.name}
                                </TableCell>
                                <TableCell align={"left"}>
                                    {row.description}
                                </TableCell>
                            </TableRow>)}
                    </TableBody>
                </Table>
            </div>
        </Collapse>

        {errorForm &&
        <ErrorDialog
            errorForm={errorForm}
            setErrorForm={setErrorForm}
            id={id}
            setItemErrors={setItemErrors}
        />}
    </div>
})