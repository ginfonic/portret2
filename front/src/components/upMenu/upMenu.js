import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import SlideMenu from '../slideMenu/slideMenu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import UpModal from '../uploads/upModal';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FolderIcon from '@material-ui/icons/FolderOpen';
import {useSelector, useDispatch} from 'react-redux';
import {CompareArrows, Error, ListAlt, Settings} from "@material-ui/icons";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import green from "@material-ui/core/colors/green";
import Tooltip from "@material-ui/core/Tooltip";
import {setErrorReportModal} from '../../redux/actions';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        "& a":{
            color:'white'
          },
          "& a:hover":{
            textDecoration:'none'
          },
        width: "100%",
    },
    menuButton: {
        marginRight: theme.spacing(3),
        cursor: 'pointer',
        color:'white'
    },
    title: {
        flexGrow: 1,
        color:'white'
    },
    account: {
        color:'white'
    }
}));

export default function ButtonAppBar(props) {
    const classes = useStyles();
    const [modalUploads, setModalUploads] = useState(false);
    let user = useSelector(state => state.mainReducer.user);
    const dispatch = useDispatch();
    let gearUser = new Set([14,17,]);
    return (
        <div className={classes.root}>
            <AppBar position="static" style={{backgroundColor: green[800]}}>
                <Toolbar>
                    <div edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <SlideMenu />
                    </div>
                    <Tooltip title={"Домашняя страница"}>
                        <Link to={process.env.REACT_APP_BASE}>
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <HomeIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                    {user.role.id === 17 &&
                    <Tooltip title={"Страница метчинга"}>
                        <Link to={process.env.REACT_APP_BASE+'/match'}>
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <CompareArrows/>
                            </IconButton>
                        </Link>
                    </Tooltip>
                    }
                    {gearUser.has(user.role.id) &&
                    <Tooltip title={"Административная панель"}>
                        <Link to={process.env.REACT_APP_BASE+'/admin'}>
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <Settings />
                            </IconButton>
                        </Link>
                    </Tooltip>
                    }
                    {
                        <Tooltip title={"Таблицы отклонений"}>
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                                        onClick={() => props.setDeviationModal(true)}>
                                <ListAlt/>
                            </IconButton>
                        </Tooltip>
                    }
                    <Typography variant="h6" className={classes.title}>
                        Портрет Территорий
                    </Typography>
                    <Tooltip title={"Структура SAP"}>
                        <Link to={process.env.REACT_APP_BASE+'/structure'}>
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <FileCopyIcon/>
                            </IconButton>
                        </Link>
                    </Tooltip>
                    <Tooltip title={"Загруженные файлы"}>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                                    onClick={() => setModalUploads(!modalUploads)}>
                            <FolderIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Сообщить об ошибке"}>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                                    onClick={() => dispatch(setErrorReportModal(true))}>
                            <Error/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Выйти"}>
                        <a href='/pkmslogout'>
                            <Button className={classes.account} startIcon={<AccountCircleIcon/>}>{user.name}</Button>
                        </a>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            {modalUploads && <UpModal setModalUploads={setModalUploads}/>}
        </div>
    );
}
