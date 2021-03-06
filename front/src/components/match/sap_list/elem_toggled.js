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
import Card from "@material-ui/core/Card";
import TableHead from "@material-ui/core/TableHead";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ErrorDialog from "./error_dialog";
import Zoom from "@material-ui/core/Zoom";
import Fab from "@material-ui/core/Fab";
import {CompareArrows, Delete, InsertLink} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";

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

    const {id, select_structure, setMatching, setFakeChosen} = props;

    const [item, setItem] = React.useState(null);
    const [progress, setProgress] = React.useState(true);
    const [refresh, setRefresh] = React.useState(false);
    const [itemErrors, setItemErrors] = React.useState([]);
    const [errorForm, setErrorForm] = React.useState(false);

    React.useEffect(() => {
        setProgress(true);
        Axios.post('match/sap_item', {select_structure, id}).then((response) => {
            setItem(response.data.item);
            setItemErrors(response.data.item_errors);
            setProgress(false);
        });
    }, [id, select_structure, refresh]);

    const handleFlags = (flag) => () => {
        Axios.post('match/sap_flag', {select_structure, id, flag}).then((response) => {
            setItem(response.data.item);
        });
    };

    const openErrorForm = () => {
        setErrorForm(true);
    };

    const handleRefresh = () => {
        setRefresh(!refresh)
    };

    const connectBestMatch = (item) => () => {
        Axios.post('match/change_connected',
            {select_structure, chosen_id: item.etalon_id, bestMatchesChecked: [], sapChecked: [id]}).then((response) => {
            handleRefresh();
        });
    };

    const unmatch = () => {
        Axios.post('match/unmatch_elem', {select_structure, id}).then((response) => {
            handleRefresh();
        });
    };

    const openMatching = () => {
        setFakeChosen(item.connectedto);
        setMatching(true)
    };

    return progress ? <LinearProgress style={{width: 200}}/> :
        <TableContainer component={Paper}>
            <Table aria-label="sap_elem_info">
                <TableBody>
                    <TableRow key="funcblock">
                        <TableCell align="left">???????????????????????????? ????????</TableCell>
                        <TableCell align="right">{item.funcblock}</TableCell>
                    </TableRow>
                    <TableRow key="lvl">
                        <TableCell align="left">??????????????</TableCell>
                        <TableCell align="right">{item.lvl}</TableCell>
                    </TableRow>
                    <TableRow key="bank">
                        <TableCell align="left">????????</TableCell>
                        <TableCell align="right">{item.bank}</TableCell>
                    </TableRow>
                    <TableRow key="parent">
                        <TableCell align="left">???????????????????????? ??????????????????????????</TableCell>
                        <TableCell align="right">{item.parent ? item.parent.depname : '-'}</TableCell>
                    </TableRow>
                    <TableRow key="connectedto">
                        <TableCell align="left">?????????????????? ??</TableCell>
                        <TableCell align="right">{item.connectedto ? item.connectedto.name + " - " : "-"}
                            {item.connectedto ? item.connectedto.lvl : null}
                            {item.connectedto ? item.connectedto.funcblock : null}
                            {item.connectedto &&
                            <Tooltip title={'????????????????'} arrow>
                                <IconButton onClick={unmatch} color={"secondary"}>
                                    <Delete/>
                                </IconButton>
                            </Tooltip>}
                        </TableCell>
                    </TableRow>
                    <TableRow key="best_match">
                        <TableCell align="left">???????????? ?????????????? ?????? ????????????????:</TableCell>
                        <TableCell align="right">
                        {Boolean(item.best_match) ?
                            item.best_match.map((item, index) =>
                                <Card key={index}>
                                    {item.name}
                                    <Button onClick={connectBestMatch(item)}>
                                        ??????????????????
                                    </Button>
                                </Card>
                            )
                            : '?????????????????????? ???????????????? ??????'}
                        </TableCell>
                    </TableRow>
                    <TableRow key="links">
                        <TableCell align="left">????????????</TableCell>
                        <TableCell align="right">
                            <Link to={process.env.REACT_APP_BASE+item.link} target={"_blank"}>
                                <Button disabled={!Boolean(item.link)} variant={"contained"}>
                                    <InsertLink/>
                                    ?????????????? ?? ?????????? ??????????????
                                </Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                    <TableRow key="units">
                        <TableCell align="left">
                            <div>
                            ??????????????????
                                {Boolean(setMatching) &&
                                <Tooltip title={"?????????????? ????????????????????"} arrow TransitionComponent={Zoom}>
                                <span style={{marginLeft: 12,}}>
                                    <Fab disabled={!Boolean(item.connectedto)} size={"small"}
                                         className={classes.fabGreen} color="primary" onClick={openMatching}>
                                        <CompareArrows/>
                                    </Fab>
                                </span>
                                </Tooltip>
                                }
                            </div>
                        </TableCell>
                        <TableCell align="right">
                            <TableContainer component={Paper} style={{maxHeight: 400, overflow: 'auto',}}>
                                <Table size={"small"} aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align={"center"}>
                                                <Typography variant={"h6"}>
                                                    ????????????????
                                                </Typography>
                                            </TableCell>
                                            <TableCell align={"center"}>
                                                <Typography variant={"h6"}>
                                                    ?????????????? ????????????
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
                        <TableCell align="left">????????????</TableCell>
                        <TableCell align="right">
                            {itemErrors.length > 0 ?
                                <TableContainer component={Paper} style={{maxHeight: 400, overflow: 'auto',}}>
                                    <Table size={"small"} aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align={"center"}>
                                                    <Typography variant={"h6"}>
                                                        ????????????????
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align={"center"}>
                                                    <Typography variant={"h6"}>
                                                        ????????????????
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
                                            <ListItemText primary={"???????????? ??????"}/>
                                        </ListItem>
                                    </List>
                            </Paper>}
                            <Button variant={"contained"} className={classes.buttonGreen} onClick={openErrorForm} size={"small"}>
                                ?????????????????? ????????????
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
                        <TableCell align="left">?????????????????? ??????????</TableCell>
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
