import React from "react";
import Axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import {green} from "@material-ui/core/colors"
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableHead from "@material-ui/core/TableHead";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ErrorDialog from "../../../../match/sap_list/error_dialog";
import { InsertLink} from "@material-ui/icons";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    buttonGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[600],
        marginTop: 12,
        '&:hover': {
            backgroundColor: green[300],
        }
    },

    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[600],
        '&:hover': {
            backgroundColor: green[300],
        }
    }
}));

export default React.memo(function ElemToggled(props) {
    const classes = useStyles();

    const {id, select_structure} = props;

    const [item, setItem] = React.useState(null);
    const [progress, setProgress] = React.useState(true);
    const [itemErrors, setItemErrors] = React.useState([]);
    const [errorForm, setErrorForm] = React.useState(false);

    React.useEffect(() => {
        setProgress(true);
        Axios.post('match/sap_item', {select_structure, id}).then((response) => {
            setItem(response.data.item);
            setItemErrors(response.data.item_errors);
            setProgress(false);
        });
    }, [id, select_structure]);

    const handleFlags = (flag) => () => {
        Axios.post('match/sap_flag', {select_structure, id, flag}).then((response) => {
            setItem(response.data.item);
        });
    };

    const openErrorForm = () => {
        setErrorForm(true);
    };

    return progress ? <LinearProgress style={{width: 200}}/> :
        <TableContainer component={Paper}>
            <Table aria-label="sap_elem_info">
                <TableBody>
                    <TableRow key="funcblock">
                        <TableCell align="left">Функциональный блок</TableCell>
                        <TableCell align="right">{item.funcblock}</TableCell>
                    </TableRow>
                    <TableRow key="lvl">
                        <TableCell align="left">Уровень</TableCell>
                        <TableCell align="right">{item.lvl}</TableCell>
                    </TableRow>
                    <TableRow key="data">
                        <TableCell align="left">Дата</TableCell>
                        <TableCell align="right">{item.date}</TableCell>
                    </TableRow>
                    <TableRow key="bank">
                        <TableCell align="left">Банк</TableCell>
                        <TableCell align="right">{item.bank}</TableCell>
                    </TableRow>
                    <TableRow key="parent">
                        <TableCell align="left">Родительское подразделение</TableCell>
                        <TableCell align="right">{item.parent ? item.parent.depname : '-'}</TableCell>
                    </TableRow>
                    <TableRow key="connectedto">
                        <TableCell align="left">Привязано к</TableCell>
                        <TableCell align="right">{item.connectedto ? item.connectedto.name + " - " : "-"}
                            {item.connectedto ? item.connectedto.lvl : null}
                            {item.connectedto ? item.connectedto.funcblock : null}
                        </TableCell>
                    </TableRow>
                    <TableRow key="links">
                        <TableCell align="left">Ссылка</TableCell>
                        <TableCell align="right">
                            <Link to={process.env.REACT_APP_BASE+item.link} target={"_blank"}>
                                <Button disabled={!Boolean(item.link)} variant={"contained"}>
                                    <InsertLink/>
                                    Открыть в новой вкладке
                                </Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                    <TableRow key="units">
                        <TableCell align="left">
                            <div>
                            Должности
                            </div>
                        </TableCell>
                        <TableCell align="right">
                            <TableContainer component={Paper} style={{maxHeight: 400, overflow: 'auto',}}>
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
                                                    Счетчик ошибок
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {item.units.map((unit, index) =>
                                            <TableRow key={index}>
                                                <TableCell align={"center"}>
                                                    {unit.unit_name}
                                                </TableCell>
                                                <TableCell align={"center"}>
                                                    {unit.errors_count}
                                                </TableCell>
                                            </TableRow>)}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TableCell>
                    </TableRow>
                    <TableRow key="error">
                        <TableCell align="left">Ошибки</TableCell>
                        <TableCell align="right">
                            {itemErrors.length > 0 ?
                                <TableContainer component={Paper} style={{maxHeight: 400, overflow: 'auto',}}>
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
                                            {itemErrors.map((item, index) =>
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
                            : <Paper>
                                    <List component="div" disablePadding style={{maxHeight: 400, overflow: 'auto',}}>
                                        <ListItem>
                                            <ListItemText primary={"Ошибок нет"}/>
                                        </ListItem>
                                    </List>
                            </Paper>}
                            <Button variant={"contained"} className={classes.buttonGreen} onClick={openErrorForm} size={"small"}>
                                Назначить ошибку
                            </Button>
                            {errorForm &&
                            <ErrorDialog
                                errorForm={errorForm}
                                setErrorForm={setErrorForm}
                                id={item.id}
                                setItemErrors={setItemErrors}
                            />}
                        </TableCell>
                    </TableRow>
                    <TableRow key="return_later">
                        <TableCell align="left">Вернуться позже</TableCell>
                        <TableCell align="right">
                            <Switch
                                checked={item.return_later}
                                onChange={handleFlags('return_later')}
                                color="primary"
                                name="checkedB"
                                inputProps={{'aria-label': 'primary checkbox'}}/>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
});