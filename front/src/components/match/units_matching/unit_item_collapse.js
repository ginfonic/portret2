import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import {Error} from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Axios from "axios";
import ErrorDialog from './error_dialog'
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper"
import DepItem from './collapse_dep_item';

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    }

}));

export default React.memo(function UnitItemCollapse(props) {
    const classes = useStyles();

    const {open, item, select_structure} = props;

    const [unitInfo, setUnitInfo] = React.useState(null);
    const [unitErrors, setUnitErrors] = React.useState([]);
    const [errorDialog, setErrorDialog] = React.useState(false);
    const [deps, setDeps] = React.useState(null);

    React.useEffect(() => {
        Axios.post('match/unit_info', {item}).then((response) => {
            setDeps(response.data.deps);
            setUnitInfo(response.data.unit_info);
            setUnitErrors(response.data.unit_errors);
        });
    }, [item]);

    const setReturnLater = () => {
        Axios.post('match/units_return_later', {item}).then((response) => {
            setUnitInfo(response.data.unit_info)
        });
    };

    return Boolean(unitInfo) ? <div><Collapse in={open} timeout="auto" unmountOnExit>
        <Divider/>
        <List component="div" disablePadding className={classes.nested}>
            {deps.map(dep => <DepItem
                dep={dep}
                select_structure={select_structure}
            /> )}
            <Divider/>
            <ListItem>
                <ListItemText primary={"Вернуться позже"}/>
                <ListItemSecondaryAction
                >
                    <Switch checked={Boolean(unitInfo.return_later)} onChange={setReturnLater}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText primary={"Ошибки: "}/>
                <ListItemSecondaryAction
                >
                    <IconButton onClick={() => setErrorDialog(true)}>
                        <Error/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </List>
        {unitErrors.length > 0 ? <div className={classes.nested}>
            <TableContainer component={Paper}>
                <Table size={"small"} aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>
                                <Typography variant={"h6"}>
                                    Название
                                </Typography>
                            </TableCell>
                            <TableCell align={"center"}>
                                <Typography variant={"h6"}>
                                    Описание
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {unitErrors.map((item, index) =>
                            <TableRow key={index}>
                                <TableCell align={"center"}>
                                    {item.name}
                                </TableCell>
                                <TableCell align={"center"}>
                                    {item.description}
                                </TableCell>
                            </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </div> : <List component="div" disablePadding className={classes.nested}> <ListItem>
            <ListItemText primary={"Ошибок нет"}/>
        </ListItem> </List>}
        <Divider/>
    </Collapse>
        {errorDialog && <ErrorDialog errorForm={errorDialog} setErrorForm={setErrorDialog} unitItem={item} setUnitErrors={setUnitErrors}/>}
    </div> : <> </>
});