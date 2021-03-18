import React from "react";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import {Toolbar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {AccountBox, AccountCircle, FormatAlignJustify, Maximize} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {green} from "@material-ui/core/colors";
import MatchingConnections from "./matching_connections"
import Info from '../etalon_list/info'
import EtalonUnits from './etalon_units'
import SapUnits from './sap_units';
import Axios from "axios";
import Button from "@material-ui/core/Button";
import MatchedTable from './matching_table'
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card/Card";
import ColorRedactor from "../../etalon/colorPart/colorRedactor";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },

    appBar: {
        position: "relative",
        backgroundColor: green[600]
    },

    bottomlabel: {
        '&:selected': {
            color: green[400],
            backgroundColor: green[300],
        }
    },

    cardHeader: {
        padding: theme.spacing(1, 2),
    },

    text: {
        ...theme.typography.body1,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },

    button: {
        backgroundColor: green[600],
        '&:hover': {
            backgroundColor: green[300],
        },
        color: "white",
    },
}));

const Transition = React.forwardRef(function Transition (props, ref) {
    return <Slide direction="up" ref={ref} {...props}/>
});

export default React.memo(function UnitsMatching(props) {
    const classes = useStyles();

    const {matching, setMatching, height, width, chosen, select_structure, setFakeChosen} = props;

    const [value, setValue] = React.useState('mass');
    const [sapUnits, setSapUnits] = React.useState([]);
    const [etalonUnits, setEtalonUnits] = React.useState([]);
    const [sapChecked, setSapChecked] = React.useState([]);
    const [selectedEtalonUnit, setSelectedEtalonUnit] = React.useState([]);
    const [selectedSapUnits, setSelectedSapUnits] = React.useState([]);
    const [matched, setMatched] = React.useState([]);
    const [changed, setChanged] = React.useState(false);
    const [openColorRedactor, setOpenColorRedactor] = React.useState(false);
    const [connected, setConnected] = React.useState([]);

    React.useEffect(() => {
        if (chosen !== null) {
            Axios.post('match/etalon_connected', {select_structure,id: chosen.id}).then((response) => setConnected(response.data.connected));
        }
    }, [chosen, select_structure]);

    React.useEffect(() => {
        Axios.post('match/units_matched', {chosen, select_structure, sap_id: value !== 'mass' ? sapChecked[0] : false, value: value === 'mass'}).then((response) => {
            setMatched(response.data.matched)
        });
    }, [changed, sapChecked, chosen, select_structure, value]);

    React.useEffect(() => {
        Axios.post('match/etalon_units', {chosen, select_structure}).then((response) => {
            setEtalonUnits(response.data.units)
        });
    }, [chosen, changed, select_structure]);

    React.useEffect(() => {
        if (sapChecked.length > 0) {
            Axios.post('match/sap_units', {sapChecked, select_structure}).then((response) => {
                setSapUnits(response.data.units);
            });
        }
    }, [sapChecked, changed, select_structure, connected]);

    const closeMatching = () => {
        setMatching(false);
        setFakeChosen(null);
    };

    const handleValueChange = (event, newValue) => {
        setValue(newValue)
    };

    const matchUnits = () => {
        setSelectedEtalonUnit([]);
        setSelectedSapUnits([]);
        Axios.post('match/match_units', {chosen, select_structure, selectedSapUnits, selectedEtalonUnit}).then((response) => {
            if (response.data.message === 'ok')
            {
                setChanged(!changed)
            }
        });
    };

    const autoMatching = () => {
        setSelectedEtalonUnit([]);
        setSelectedSapUnits([]);
        Axios.post('match/auto_units_matching', {connected}).then((response) => {
            if (response.data.message === 'ok')
            {
                setChanged(!changed)
            }
        });
    };

    return <Dialog fullScreen open={matching} onClose={closeMatching} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6">
                    Матчинг должностей
                </Typography>
                <div className={classes.grow}/>
                <BottomNavigation
                    value={value}
                    onChange={handleValueChange}
                    style={{width: 300}}
                >
                    <BottomNavigationAction label="массовый" value="mass" icon={<FormatAlignJustify color="inherit"/>} className={classes.bottomlabel}/>
                    <BottomNavigationAction label="по одному" value="one" icon={<Maximize color="inherit"/>} className={classes.bottomlabel}/>
                </BottomNavigation>
                <div className={classes.grow}/>
                <IconButton autoFocus edge="start" color="inherit" onClick={closeMatching}>
                    <CloseIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
        <Grid container alignItems="center" justify="flex-start" spacing={3} style={{height: height / 1.4, width: width, marginLeft: 25}}>
            <Grid item xs={2}>
                <Paper elevation={3}>
                    <Info item={chosen} height={height}/>
                </Paper>
            </Grid>
            <Grid item xs={7}>
                <Grid container direction="row" justify="flex-start" spacing={4} style={{height: height / 1.2}}>
                    <Grid item xs={12}>
                        <Paper elevation={3}>
                            <MatchedTable matched={matched} chosen={chosen} height={height} select_structure={select_structure} changed={changed} setChanged={setChanged}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={3}>
                            <Grid container spacing={3} style={{height: height / 2 + 13}}>
                                <Grid item xs={4}>
                                    <EtalonUnits
                                        units={etalonUnits}
                                        height={height}
                                        selected={selectedEtalonUnit}
                                        setSelected={setSelectedEtalonUnit}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Grid container direction="column" justify="space-between" alignItems="center" spacing={2} style={{height: "100%"}}>
                                        <Grid item>
                                            <Button
                                                disabled={selectedSapUnits.length === 0 ||
                                                selectedEtalonUnit.length === 0}
                                                variant="contained"
                                                className={classes.button}
                                                onClick={matchUnits}
                                            >
                                                Сматчить
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                className={classes.button}
                                                onClick={autoMatching}
                                            >
                                                Автоматчинг
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Card>
                                                <Typography variant={"h6"}>
                                                    Обозначение иконок категорий:
                                                </Typography>
                                                <div className={classes.text}>
                                                    <AccountBox/> - Основная категория
                                                </div>
                                                <div className={classes.text}>
                                                    <AccountCircle/> - Дополнительная категория
                                                </div>
                                            </Card>
                                        </Grid>
                                        <Grid item>
                                            <Button variant={"outlined"} onClick={() => setOpenColorRedactor(true)}>
                                                Редактор категорий
                                            </Button>
                                        </Grid>
                                        {openColorRedactor &&
                                            <ColorRedactor
                                                openColorRedactor={openColorRedactor}
                                                setOpenColorRedactor={setOpenColorRedactor}
                                            />
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={4}>
                                    {sapChecked.length === 0 ? <Card style={{height: height / 2}}>
                                            <CardHeader
                                                className={classes.cardHeader}
                                                title={`Должности SAP`}
                                                subheader={"Всего: ?"}
                                            />
                                            <Divider/>
                                            <Typography variant={"h6"}>
                                                Выберите элемент из SAP
                                            </Typography>
                                        </Card> :
                                        <SapUnits
                                            units={sapUnits}
                                            height={height}
                                            select_structure={select_structure}
                                            selected={selectedSapUnits}
                                            setSelected={setSelectedSapUnits}
                                        />
                                    }
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3}>
                <Paper elevation={3} style={{height: height / 1.4}}>
                    <MatchingConnections connected={connected} select_structure={select_structure} height={height} value={value} checked={sapChecked} setChecked={setSapChecked}/>
                </Paper>
            </Grid>
        </Grid>
    </Dialog>
});