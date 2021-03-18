import React from "react";
import Card from "@material-ui/core/Card/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import ListMenu from "../listmenu/main_menu";
import RenderArray from "./etalon_list_elem"
import Axios from "axios";
import Backdrop from "@material-ui/core/Backdrop";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    cardHeader: {
        padding: theme.spacing(1, 2),
        '&$action': {
            width: 150
        }
    },
    action : {
        width: 170
    },

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },

}));

export default React.memo(function EtalonList(props) {
        const classes = useStyles();

        const {
            chosen,
            setChosen,
            add,
            setAdd,
            height,
            select_structure,
            setSelect_structure,
            connected
        } = props;

        const [list, setList] = React.useState([]);
        const [funcblockFilter, setFuncblockFilter] = React.useState([]);
        const [lvlFilter, setLvlFilter] = React.useState([]);
        const [searchFilter, setSearchFilter] = React.useState('');
        const [funcblock, setFuncblock] = React.useState([]);
        const [lvl, setLvl] = React.useState([]);
        const [connections, setConnections] = React.useState([]);
        const [progress, setProgress] = React.useState(true);
        const [searchAnchor, setSearchAnchor] = React.useState(null);
        const [elemsHeight, setElemsHeight] = React.useState(60);

        React.useEffect(() => {
            let menu = document.getElementById('etalon_menu');
            let header = document.getElementById('etalon_header');
            if (menu && header) setElemsHeight(menu.offsetHeight + header.offsetHeight);
        });

        React.useEffect(() => {
            setProgress(true);
            Axios.post('match/etalon_data',
                {select_structure, funcblockFilter, searchFilter, lvlFilter
                    , connections}).then((response) => {
                setList(response.data.final);
                setProgress(false);
            }).catch(err => {
                console.log(err);
                setProgress(false);
            });
        }, [funcblockFilter, searchFilter, lvlFilter, connections, select_structure, connected]);

        React.useEffect(() => {
            Axios.post('match/etalon_funcblocks',
                {select_structure,}).then((response) => setFuncblock(response.data.funcblocks));
        }, [select_structure]);

        React.useEffect(() => {
            Axios.post('match/etalon_lvls',
                {select_structure,}).then((response) => setLvl(response.data.lvls));
        }, [select_structure]);

        const selectTb = () => {
            setChosen(null);
            setAdd(false);
            setSelect_structure('tb');
        };

        const selectGosb = () => {
            setChosen(null);
            setAdd(false);
            setSelect_structure('gosb');
        };

        return <Paper elevation={6} style={{height: height - 16}}>
            <Backdrop className={classes.backdrop} open={progress}>
                Loading...
            </Backdrop>
            <Card>
                <CardHeader
                    id="etalon_header"
                    classes={{
                        root: classes.cardHeader,
                        action: classes.action
                    }}
                    title="Типовая структура"
                    action={
                        <Grid container spacing={1} alignItems="center" justify="center" direction="row">
                            <Grid item xs={6}>
                                <Typography variant="button">
                                    ТБ
                                </Typography>
                                <Checkbox checked={select_structure === 'tb'} onClick={selectTb}/>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="button">
                                    ГОСБ
                                </Typography>
                                <Checkbox checked={select_structure === 'gosb'} onClick={selectGosb}/>
                            </Grid>
                        </Grid>
                    }
                />
                <Divider/>
                <div style={{
                    overflow: 'auto',
                    height: height - elemsHeight - 16
                }}>
                    <RenderArray
                        array={list}
                        add={add}
                        setAdd={setAdd}
                        setChosen={setChosen}
                        chosen={chosen}
                        setProgress={setProgress}
                        select_structure={select_structure}/>
                </div>
            </Card>
            <ListMenu
                funcblockFilter={funcblockFilter}
                setFuncblockFilter={setFuncblockFilter}
                lvlFilter={lvlFilter}
                setLvlFilter={setLvlFilter}
                connections={connections}
                setConnections={setConnections}
                funcblock={funcblock}
                lvl={lvl}
                setFuncblock={setFuncblock}
                array={list}
                setChosen={setChosen}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter} id={"etalon_menu"}
                setAdd={setAdd}
                searchAnchor={searchAnchor}
                setSearchAnchor={setSearchAnchor}
                select_structure={select_structure}
            />
        </Paper>
    }
)