import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import axios from "axios";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {CompareArrows, CompareArrowsOutlined, Delete, Done, Refresh, RemoveCircleOutline} from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import UploadDialog from '../uploadSap/mainUploadSap';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Tooltip from "@material-ui/core/Tooltip";
import green from "@material-ui/core/colors/green";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        marginTop: 15,
        position: 'relative',
        height: '100%',
    },
    list: {
        backgroundColor: theme.palette.background.paper,
        height: '80%',
        overflowY:'auto',
        '&:hover':{
            transition: '10s ease-out',
        },
        position: "relative",
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
        '&$action': {
            width: 150
        }
    },
    action : {
        width: 170
    },
    button: {
        position: "absolute",
        right: 15,
        bottom: 15
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export default function SapFiles(props) {
    const classes = useStyles();

    const [update, setUpdate] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [uploadSap, setUploadSap] = React.useState(false);

    React.useEffect(() => {
        axios.get('admin/sap_files').then((res) => {
            setData(res.data.files)
        })
    }, [update]);

    return (
        <Card className={classes.root}>
            <CardHeader
                title="Загруженные файлы SAP"
                action={
                    <IconButton onClick={() => {
                        axios.get('admin/sap_files').then((res) => {
                            setData(res.data.files)
                        })
                    }
                    }>
                        <Refresh/>
                    </IconButton>
                }
            />
            <Divider/>
            <div className={classes.list}>
                {data.map(item =>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                        >
                            <Typography className={classes.heading}>{item.date}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List style={{width: '100%'}}>
                                {item.files.length === 0 && 'Нет загруженных файлов'}
                                {item.files.map((item, index) => {
                                    return (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                {index + 1}
                                            </ListItemIcon>
                                            <ListItemIcon>
                                                {item.uploaded ?
                                                    <Tooltip title={"Файл загружен"}>
                                                        <Done/>
                                                    </Tooltip> : item.in_load ?
                                                        <Tooltip title={`Файл загружается - ${item.load_progress}%`}>
                                                            <CircularProgress
                                                                value={item.load_progress}
                                                                variant={"determinate"}
                                                            />
                                                        </Tooltip> :
                                                        <Tooltip title={"Файл не был загружен"}>
                                                            <RemoveCircleOutline/>
                                                        </Tooltip>
                                                }
                                                {item.last_matching_update ?
                                                    <Tooltip title={`Последнее обновление метчинга: ${item.last_matching_update}`}>
                                                        <CompareArrows style={{color: green[500]}}/>
                                                    </Tooltip> :
                                                    <Tooltip title={`Метчинг не обновлялся`}>
                                                        <CompareArrowsOutlined color={"disabled"}/>
                                                    </Tooltip>
                                                }
                                            </ListItemIcon>
                                            <ListItemText primary={`${item.name}`}/>
                                            <ListItemSecondaryAction>
                                                <Tooltip title={"Подгрузить данные из сохраненного метчинга"}>
                                                    <IconButton onClick={() => {
                                                        axios.post('admin/sap_files_matching_update', {id: item.id}).then((res) => {
                                                            setData(res.data.files)
                                                        })
                                                    }}>
                                                        <CompareArrows/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={"Удалить файл и все загруженные с ним данные"}>
                                                    <IconButton onClick={() => {
                                                        axios.post('admin/sap_files_delete', {id: item.id, path: item.filepath}).then((res) => {
                                                            setData(res.data.files)
                                                        })
                                                    }}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </AccordionDetails>
                    </Accordion>)}
            </div>
            <Divider/>
            <Button variant={"outlined"} onClick={() => setUploadSap(true)} className={classes.button}>
                Загрузить данные SAP
            </Button>
            {uploadSap &&
            <UploadDialog
                open={uploadSap}
                setOpen={setUploadSap}
                update={update}
                setUpdate={setUpdate}
            />
            }
        </Card>
    );
}
