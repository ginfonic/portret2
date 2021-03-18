import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import {FormControlLabel, Toolbar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {green} from "@material-ui/core/colors";
import ApprovedDeviationsTable from './approvedDeviations/approvedDeviationsTable'
import DeviationCount from './deviationCountUrmSameDep/deviationCount';
import DeviationUrm from './deviationCountUrmSameDep/deviationUrm';
import SameDepartmentsDeviationsTable from './deviationCountUrmSameDep/deviationSameDep';
import DeviationMatchErrors from './deviationMatchErrors/deviationMatchErrors';
import DeviationMatchUnitErrors from './deviationMatchUnitErrors/deviationMatchUnitErrors';
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from '@material-ui/icons/Menu'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {BarChart, GetApp} from "@material-ui/icons";
import Switch from "@material-ui/core/Switch";
import MainGraphs from "./graphs/main"
import Fab from "@material-ui/core/Fab";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Tooltip from "@material-ui/core/Tooltip";
import Axios from "axios";
import Container from "@material-ui/core/Container";
import * as XLSX from 'xlsx';

const Transition = React.forwardRef(function Transition (props, ref) {
    return <Slide direction="up" ref={ref} {...props}/>
});

const tabs = [
    "Согласованные отклонения",
    "Отклонения в норме подчинения",
    "Отклонения УРМ",
    "Отклонения ошибок метчинга",
    "Отклонения ошибок должностей метчинга",
    "Отклонения по количеству одинаковых подрязделений"];

export default React.memo(function DeviationRedactor(props) {
    const useStylesDeviation = makeStyles((theme) => ({
        dev_grow: {
            flexGrow: 1,
        },

        dev_bottomlabel: {
            '&:selected': {
                color: green[400],
                backgroundColor: green[300],
            }
        },

        dev_appBar: {
            position: "relative",
            backgroundColor: green[800],
            zIndex: theme.zIndex.drawer + 1,
            color: "white"
        },

        dev_content: {
            flexgrow: 1,
            padding: theme.spacing(3),
            height: '100%',
        },

        dev_drawer: {
            width: 350,
            flexShrink: 0,
        },

        dev_drawerPaper: {
            width: 350,
        },

        dev_drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },

        dev_toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar
        }
    }));

    const classes = useStylesDeviation();

    const {deviationRedactor, setDeviationRedactor} = props;
    const [tab, setTab] = React.useState(null);
    const [openDrawer, setOpenDrawer] = React.useState(true);
    const [graph, setGraph] = React.useState(false);
    const [numGraph, setNumGraph] = React.useState(2);
    const [type, setType] = useState('tb');
    const [globalGraphs, setGlobalGraphs] = useState(false);

    const toolItem = function (num) {
        return <ListItem selected={tab === num} button onClick={() => {
            setGlobalGraphs(false);
            setGraph(false);
            setTab(num);
            setOpenDrawer(false);
        }}>
            <ListItemText primary={tabs[num]} style={{marginRight: 30}}/>
            <ListItemSecondaryAction>
                <Fab
                    color={graph && tab === num ? "primary" : "default"}
                    size={"small"}
                    onClick={() => {
                        setGlobalGraphs(false);
                        setGraph(true);
                        setTab(num);
                        setOpenDrawer(false);
                    }}
                >
                    <BarChart/>
                </Fab>
            </ListItemSecondaryAction>
        </ListItem>
    };

    const downloadDeviationsXLSX = () => {
        Axios.post('deviations/downloadXLSX', {tab, tb_gosb: type}).then((response) => {
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';

            let table = response.data.table;
            const ws = XLSX.utils.json_to_sheet(table);
            const wb = {Sheets: {'data': ws}, SheetNames: ['data']};
            const excelBuffer = XLSX.write(wb, {bookType: "xlsx", type: "array"});
            const data = new Blob([excelBuffer], {type: fileType});
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', tabs[tab] + fileExtension);
            document.body.appendChild(link);
            link.click();
        })
    };

    return <Dialog fullScreen open={deviationRedactor} onClose={() => setDeviationRedactor(false)} TransitionComponent={Transition}>
        <AppBar className={classes.dev_appBar} color={"transparent"}>
            <Toolbar>
                <IconButton color={"inherit"} onClick={() => setOpenDrawer(!openDrawer)} edge={"start"} style={{marginRight: 10}}>
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6">
                    Редактирование отклонений
                </Typography>
                {tab !== null &&
                <div style={{marginLeft: 20}}>
                    <Switch checked={graph} onChange={() => setGraph(!graph)} color={"default"} disabled={tab === 3}/>
                    <Typography variant="button">
                        {graph ? `Графики` : `Таблица`}
                    </Typography>
                </div>
                }
                {tab !== 0 &&
                <FormControlLabel
                    style={{marginBottom: 0, marginLeft: 5, marginRight: 0}}
                    label='ТБ'
                    control={<Checkbox color={"secondary"}/>}
                    value='tb'
                    onChange={()=>setType('tb')}
                    checked={type==='tb'}
                />}
                {tab !== 0 &&
                <FormControlLabel
                    style={{marginBottom: 0, marginLeft: 5, marginRight: 0}}
                    label='ГОСБ'
                    control={<Checkbox color={"secondary"}/>}
                    value='gosb'
                    onChange={()=>setType('gosb')}
                    checked={type==='gosb'}
                />}
                {graph &&
                <div style={{marginLeft: 20}}>
                    <Typography variant="button" style={{marginRight: 5}}>
                        Графиков на странице:
                    </Typography>
                    <ButtonGroup size={"small"}>
                        <Button variant={numGraph === 1 ? 'contained' : 'outlined'} onClick={() => setNumGraph(1)} color={"inherit"}>
                            1
                        </Button>
                        <Button variant={numGraph === 2 ? 'contained' : 'outlined'} onClick={() => setNumGraph(2)} color={"inherit"}>
                            2
                        </Button>
                        <Button variant={numGraph === 4 ? 'contained' : 'outlined'} onClick={() => setNumGraph(4)} color={"inherit"}>
                            4
                        </Button>
                    </ButtonGroup>
                </div>}
                {tab !== null ? <Tooltip title={'Загрузить Excel'} style={{marginLeft: 15}}>
                    <IconButton onClick={downloadDeviationsXLSX}>
                        <GetApp/>
                    </IconButton>
                </Tooltip> : null}
                <div className={classes.dev_grow}/>
                <Typography variant="h6">
                    {tabs[tab]}
                    {globalGraphs && 'Общие графики'}
                </Typography>
                {graph && <BarChart style={{marginLeft: 10}}/>}
                <div className={classes.dev_grow}/>
                <div style={{width: 546 + (graph ? 330 : 0) + (tab === 3 ? 200 : 0) - (tab === 0 ? 150 : 0), height: 20}}/>
                <IconButton autoFocus edge="start" color="inherit" onClick={() => setDeviationRedactor(false)}>
                    <CloseIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
        <Drawer
            className={classes.dev_drawer}
            variant={"persistent"}
            open={openDrawer}
            classes={{paper: classes.dev_drawerPaper}}
        >
            <Toolbar />
            <List>
                {toolItem(0)}
                {toolItem(1)}
                {toolItem(2)}
                {toolItem(3)}
                {toolItem(4)}
                {toolItem(5)}
                <Divider/>
                <ListItem
                    selected={globalGraphs}
                    button onClick={() => {
                    setTab(null);
                    setGlobalGraphs(true);
                    setOpenDrawer(false);
                    setGraph(true);
                    setNumGraph(1);
                }}>
                    <ListItemText primary={'Общие графики'} style={{marginRight: 30}}/>
                    <ListItemIcon>
                        <Fab color={globalGraphs ? "primary" : "default"} size={"small"}>
                            <BarChart/>
                        </Fab>
                    </ListItemIcon>
                </ListItem>
            </List>
        </Drawer>
        <main className={classes.dev_content} onClick={() => setOpenDrawer(false)}>
            <React.Fragment>
                <Container maxWidth={"xl"} style={{height: '90%'}}>
                    {globalGraphs &&
                        <MainGraphs numGraph={numGraph} selected={'global'} type={type}/>
                    }
                    {tab === 0 &&
                    (graph ?
                        <MainGraphs numGraph={numGraph} selected={'approved'} type={type}/> :
                        <ApprovedDeviationsTable/>)
                    }
                    {tab === 1 &&
                    (graph ?
                        <MainGraphs numGraph={numGraph} selected={'count'} type={type}/> :
                        <DeviationCount type={type}/>)
                    }
                    {tab === 2 &&
                    (graph ?
                        <MainGraphs numGraph={numGraph} selected={'urm'} type={type}/> :
                        <DeviationUrm type={type}/>)
                    }
                    {tab === 3 &&
                    (graph ?
                        <MainGraphs numGraph={numGraph} selected={'match'} type={type}/> :
                        <DeviationMatchErrors select_structure={type}/>)
                    }
                    {tab === 4 &&
                    (graph ?
                        <MainGraphs numGraph={numGraph} selected={'matchUnit'} type={type}/> :
                        <DeviationMatchUnitErrors select_structure={type}/>)
                    }
                    {tab === 5 &&
                    (graph ?
                        <MainGraphs numGraph={numGraph} selected={'sameDep'} type={type}/> :
                        <SameDepartmentsDeviationsTable type={type}/>)
                    }
                </Container>
            </React.Fragment>
        </main>
    </Dialog>
})
