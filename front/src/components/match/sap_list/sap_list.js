import React from "react";
import Card from "@material-ui/core/Card/Card";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Divider from "@material-ui/core/Divider";
import CardHeader from "@material-ui/core/CardHeader";
import ListMenu from "../listmenu/main_menu";
import SapListElem from "./list_elem"
import Axios from "axios";
import Backdrop from "@material-ui/core/Backdrop";
import AutoSizer from 'react-virtualized-auto-sizer';
import {VariableSizeList} from "react-window";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import {Close, Refresh} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 700,
    },

    list: {
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        padding: 0
    },

    cardHeader: {
        padding: theme.spacing(1, 2),
    },

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    }

}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default React.memo(function SapList(props) {
    const classes = useStyles();

    const {checked, setChecked, connected, select_structure,
        setSeeSap, setMatching, setFakeChosen, setConnected,
        mass, setMass, sap, setSap, setBestMatchesChecked,
        setBestMatches} = props;

    const [searchFilter, setSearchFilter] = React.useState('');
    const [funcblockFilter, setFuncblockFilter] = React.useState([]);
    const [lvlFilter, setLvlFilter] = React.useState([]);
    const [bankFilter, setBankFilter] = React.useState([]);
    const [flags, setFlags] = React.useState({
        return_later: false, error_flag: false, not_matched: true, error_unit_flag: false, units_return_later: false
    });
    const [funcblock, setFuncblock] = React.useState([]);
    const [lvl, setLvl] = React.useState([]);
    const [banks, setBanks] = React.useState([]);
    const [progress, setProgress] = React.useState(false);
    const [elemsHeight, setElemsHeight] = React.useState(200);
    const [searchAnchor, setSearchAnchor] = React.useState(null);
    const [refresh, setRefresh] = React.useState(true);

    const numberOfChecked = () => checked.length;

    React.useEffect(() => {
        let menu = document.getElementById('sap_menu');
        let header = document.getElementById('sap_header');
        if (menu && header) setElemsHeight(menu.offsetHeight + header.offsetHeight);
        });

    React.useEffect(() => {
        setProgress(true);
        Axios.post('match/sap_data',
            {select_structure, funcblockFilter, searchFilter, lvlFilter, bankFilter, connected, flags, mass})
            .then((response) => {
                setSap(response.data.sap_list);
                setProgress(false);
            });
        }, [funcblockFilter, searchFilter, connected,
        lvlFilter, bankFilter, flags, select_structure, refresh, mass]);

    React.useEffect(() => {
        Axios.post('match/sap_funcblocks',
            {select_structure}).then((response) => setFuncblock(response.data.funcblocks));
        }, [select_structure]);

    React.useEffect(() => {
        Axios.post('match/sap_lvls', {select_structure,}).then((response) => setLvl(response.data.lvls));
        }, [select_structure]);

    React.useEffect(() => {
            Axios.post('match/sap_banks', {select_structure,}).then((response) => setBanks(response.data.banks));
        }, [select_structure]);

    const handleCheckAllNoMass = (filtered_array) => () => {
        if (numberOfChecked() > 0 && numberOfChecked() < filtered_array.length) {
            setChecked([])
        }
        else if (numberOfChecked() === filtered_array.length) {
            setChecked(not(checked, filtered_array.map((item, index) => item.id)));
        } else {
            setChecked(union(checked, filtered_array.map((item, index) => item.id)));
        }
    };

    const handleCheckAllMass = (array) => () => {
        if (numberOfChecked() > 0 && numberOfChecked() <= array.length) {
            setChecked([])
        } else {
            setChecked(array);
        }
    };

    const handleRefresh = () => {
        setRefresh(!refresh)
    };

    const SapRow = ({index, style}) => {
        return <div style={style} key={index}>
        <SapListElem
            item={sap[index]}
            index={index}
            checked={checked}
            setChecked={setChecked}
            select_structure={select_structure}
            handleRefresh={handleRefresh}
            setMatching={setMatching}
            setFakeChosen={setFakeChosen}
            mass={mass}
        />
        </div>
    };

    const rowheights = new Array(sap.length)
        .fill(true)
        .map((chunk, index) => {
            let baseheight = 24;
            if (sap[index].depname.length < 20) return baseheight + 24 + 4;
            if (sap[index].depname.length < 28) return baseheight * 2 + 24 + 4;
            if (sap[index].depname.length < 40) return baseheight * 3 + 24 + 4;
            if (sap[index].depname.length < 60) return baseheight * 4 + 24 + 4;
            if (sap[index].depname.length < 80) return baseheight * 5 + 24 + 4;
            if (sap[index].depname.length < 100) return baseheight * 6 + 24 + 4;
        });

    const rowheight = index => {
        return rowheights[index]
    };

    const handleSeeSap = () => {
        setSeeSap(false)
    };

    return <AutoSizer>
        {({height, width}) => (
            <Paper elevation={10}>
                <Backdrop className={classes.backdrop} open={progress}>
                    Loading...
                </Backdrop>
                <Card style={{height: height, width: width}}>
                    <CardHeader
                        className={classes.cardHeader}
                        id="sap_header"
                        avatar={
                            <div>
                                <FormControlLabel
                                    label='Массовый метчинг'
                                    control={<Checkbox color={"default"}/>}
                                    onChange={()=> {
                                        setChecked([]);
                                        setBestMatchesChecked([]);
                                        setBestMatches([]);
                                        setSap([]);
                                        setConnected([]);
                                        setMass(!mass);
                                    }}
                                    checked={mass}
                                />
                                <Checkbox
                                    onClick={mass ? handleCheckAllMass(sap) : handleCheckAllNoMass(sap)}
                                    checked={numberOfChecked(sap) === sap.length && sap.length !== 0}
                                    indeterminate={numberOfChecked(sap) !== sap.length && numberOfChecked(sap) !== 0}
                                    disabled={sap.length === 0}
                                    inputProps={{ 'aria-label': 'all items selected' }}
                                />
                            </div>
                        }
                        title="Структура SAP"
                        subheader={`${numberOfChecked(sap)}/${sap.length} selected`}
                        action={
                            <div>
                                <Tooltip TransitionComponent={Zoom} title={"Обновить данные"}>
                                    <IconButton onClick={handleRefresh}>
                                        <Refresh/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip TransitionComponent={Zoom} title={"Закрыть SAP"}>
                                    <IconButton onClick={handleSeeSap}>
                                        <Close/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        }
                    />
                <Divider/>
                    <List className={classes.list}>
                        <VariableSizeList
                            height={height - elemsHeight}
                            itemCount={sap.length}
                            width={width}
                            itemSize={rowheight}>
                            {SapRow}
                        </VariableSizeList>
                    </List>
                    <ListMenu
                        funcblockFilter={funcblockFilter}
                        setFuncblockFilter={setFuncblockFilter}
                        lvlFilter={lvlFilter}
                        setLvlFilter={setLvlFilter}
                        bankFilter={bankFilter}
                        setBankFilter={setBankFilter}
                        banks={banks}
                        funcblock={funcblock}
                        lvl={lvl}
                        setFuncblock={setFuncblock}
                        array={sap}
                        setChosen={false}
                        searchFilter={searchFilter}
                        setSearchFilter={setSearchFilter}
                        id={"sap_menu"}
                        flags={flags}
                        setFlags={setFlags}
                        searchAnchor={searchAnchor}
                        setSearchAnchor={setSearchAnchor}
                        select_structure={select_structure}
                        connected={connected}
                        mass={mass}
                    />
                </Card>
            </Paper>
        )}
    </AutoSizer>
}
)