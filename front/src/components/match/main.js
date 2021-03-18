import React from "react";
import Grid from "@material-ui/core/Grid";
import EtalonList from "./etalon_list/etalon_list";
import Info from "./etalon_list/info";
import {Add, CompareArrows, Delete, PostAdd} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import EtalonConnections from "./etalon_list/etalon_connections";
import SapList from "./sap_list/sap_list";
import BestMatches from "./best_matches";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import Axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import UnitsMatching from './units_matching/main_units_matching'
import Zoom from "@material-ui/core/Zoom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },

    fab: {
        width: 70,
    },

    greenFab: {
        backgroundColor: green[600],
        '&:hover': {
            backgroundColor: green[300],
        }
    },

    deleteFab: {
        backgroundColor: '#ffe5e6',
        color: red[500],
        '&:hover': {
            backgroundColor: red[100],
        }
    },

    addFab: {
        backgroundColor: '#ecffed',
        color: green[500],
        '&:hover': {
            backgroundColor: green[100],
        }
    },

    appbar_match_page: {
        flexGrow: 1,
        backgroundColor: green[600]
    },
}));

export default function Main() {
    const classes = useStyles();

    const [chosen, setChosen] = React.useState(null);
    const [fakeChosen, setFakeChosen] = React.useState(null);
    const [add, setAdd] = React.useState(false);
    const [sapChecked, setSapChecked] = React.useState([]);
    const [bestMatchesChecked, setBestMatchesChecked] = React.useState([]);
    const [connectedChecked, setConnectedChecked] = React.useState([]);
    const [connected, setConnected] = React.useState([]);
    const [connectedCount, setConnectedCount] = React.useState(0);
    const [bestMatches, setBestMatches] = React.useState([]);
    const [height, setHeight] = React.useState(document.documentElement.clientHeight);
    const [width, setWidth] = React.useState(document.documentElement.clientWidth);
    const [seeSap, setSeeSap] = React.useState(false);
    const [select_structure, setSelect_structure] = React.useState('tb');
    const [mass, setMass] = React.useState(true);
    const [matching, setMatching] = React.useState(false);
    const [sap, setSap] = React.useState([]);

    React.useEffect(() => {
        setHeight(document.documentElement.clientHeight - 100);
        setWidth(document.documentElement.clientWidth - 50)
    });

    React.useEffect(() => {
        setConnectedChecked([]);
    }, [chosen]);

    React.useEffect(() => {
        if (chosen !== null) {
            Axios.post('match/etalon_connected', {
                select_structure,
                id: chosen.id,
                mass
            }).then((response) => {
                setConnected(response.data.connected);
                setConnectedCount(response.data.connected_count);
            });
        }
    }, [chosen, select_structure, mass]);

    const handleConnectClick = () => {
        Axios.post('match/change_connected', {
            select_structure,
            chosen_id: chosen.id,
            bestMatchesChecked,
            sapChecked,
            mass
        }).then((response) => setConnected(response.data.connected));
        setBestMatchesChecked([]);
        setSapChecked([]);
    };

    const handleRemoveClick = () => {
        setConnectedChecked([]);
        Axios.post('match/remove_connected', {
            select_structure,
            chosen_id: chosen.id,
            connectedChecked,
            mass
        })
            .then((response) => setConnected(response.data.connected));
    };

    const handleSeeSap = () => {
        setSeeSap(true);
    };

    const openMatching = () => {
        setMatching(true)
    };

    return <div>
        {matching && <UnitsMatching
            matching={matching}
            setMatching={setMatching}
            height={height}
            width={width}
            select_structure={select_structure}
            chosen={ fakeChosen ? fakeChosen : chosen}
            setFakeChosen={setFakeChosen}
        />}
        <Grid container alignItems="stretch" spacing={2} style={{height: height, width: width, marginLeft: 5, marginTop: 15}}>
            <Grid item xs={3}>
                <EtalonList
                    chosen={chosen}
                    setChosen={setChosen}
                    add={add}
                    setAdd={setAdd}
                    connected={connected}
                    height={height}
                    select_structure={select_structure}
                    setSelect_structure={setSelect_structure}
                />
            </Grid>
            <Grid item xs={3} id={"info_and_connections"}>
                {chosen &&
                <Paper elevation={6}>
                    <Info item={chosen} height={height}/>
                    <AppBar position={"static"} className={classes.appbar_match_page} id={'main_appbar'}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Toolbar>
                                    <Tooltip title={"Метчинг должностей"} arrow TransitionComponent={Zoom}>
                                        <div>
                                            <Fab disabled={connected.length === 0} size={"small"} className={classes.greenFab} color="primary" onClick={openMatching}>
                                                <CompareArrows/>
                                            </Fab>
                                        </div>
                                    </Tooltip>
                                </Toolbar>
                            </Grid>
                            <Grid item xs={6}>
                                <Toolbar>
                                    <div className={classes.grow}/>
                                    {chosen &&
                                    <Tooltip
                                        title={`Отвязать выбранные значения`}
                                        arrow
                                        TransitionComponent={Zoom}
                                    >
                                        <div>
                                            <Fab
                                                size={"small"}
                                                onClick={handleRemoveClick}
                                                className={classes.deleteFab}
                                                disabled={connectedChecked.length === 0}
                                            >
                                                <Delete/>
                                            </Fab>
                                        </div>
                                    </Tooltip>
                                    }
                                    <div className={classes.grow}/>
                                    {chosen &&
                                    <Tooltip
                                        title={`Привязать выбранные значения`}
                                        arrow
                                        TransitionComponent={Zoom}
                                    >
                                        <div>
                                            <Fab size={"small"}
                                                 onClick={handleConnectClick}
                                                 className={classes.addFab}
                                                 disabled={(sapChecked.length + bestMatchesChecked.length) === 0}
                                            >
                                                <Add/>
                                            </Fab>
                                        </div>
                                    </Tooltip>
                                    }
                                </Toolbar>
                            </Grid>
                        </Grid>
                    </AppBar>
                    <EtalonConnections
                        add={add}
                        seeSap={seeSap}
                        connected={connected}
                        setConnected={setConnected}
                        checked={connectedChecked}
                        setChecked={setConnectedChecked}
                        height={height}
                        select_structure={select_structure}
                        setMatching={setMatching}
                        setFakeChosen={setFakeChosen}
                        connectedCount={connectedCount}
                        mass={mass}
                    />
                </Paper>
                }
            </Grid>
            <Grid item xs={3}>
                {add ? <BestMatches
                    bestMatchesChecked={bestMatchesChecked}
                    setBestMatchesChecked={setBestMatchesChecked}
                    bestMatches={bestMatches}
                    setBestMatches={setBestMatches}
                    connected={connected}
                    chosen_id={chosen.id}
                    height={height}
                    select_structure={select_structure}
                    setMatching={setMatching}
                    setFakeChosen={setFakeChosen}
                    setAdd={setAdd}
                    mass={mass}
                    setMass={setMass}
                    setSap={setSap}
                    setSapChecked={setSapChecked}
                    setConnected={setConnected}
                /> : chosen &&
                    <div style={{float: 'right', paddingRight: 8, paddingTop: 4}}>
                    <Tooltip
                        title={`Открыть списки для метчинга`}
                        arrow
                        TransitionComponent={Zoom}
                    >
                        <IconButton onClick={() => setAdd(true)}>
                            <PostAdd/>
                        </IconButton>
                    </Tooltip>
                </div>
                }
            </Grid>
            <Grid item xs={3}>
                {seeSap ? <SapList
                    checked={sapChecked}
                    setChecked={setSapChecked}
                    connected={connected}
                    select_structure={select_structure}
                    setSeeSap={setSeeSap}
                    setMatching={setMatching}
                    setFakeChosen={setFakeChosen}
                    mass={mass}
                    setMass={setMass}
                    sap={sap}
                    setSap={setSap}
                    setBestMatchesChecked={setBestMatchesChecked}
                    setConnected={setConnected}
                    setBestMatches={setBestMatches}
                /> : <div style={{float: 'right', paddingRight: 8, paddingTop: 4}}>
                    <Tooltip placement="bottom" title="Открыть список SAP" aria-label="open_sap" TransitionComponent={Zoom}>
                    <IconButton onClick={handleSeeSap}>
                        <Add/>
                    </IconButton>
                    </Tooltip>
                    </div>
                }
            </Grid>
        </Grid>
    </div>
}