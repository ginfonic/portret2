import React, {useState, useEffect} from 'react';
import MenuButton from './menuButton';
import EtalonStructure from './etalonStructure';
import Progress from './progress';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import FootModalInfo from './modals/footModalInfo';
import {setEtalonModal} from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {setEtalonCount} from '../../redux/actions';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        minHeight: '600px',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    title: {
        color: 'green',
        marginTop: '10px',
        alignSelf: 'center',
        fontSize: '1.3em',
        textAlign: 'center'
    },
    menuBtn: {
        marginLeft: '10px'
    }
}));

export default function EtalonMain(props) {

    const classes = useStyles();
    const [deps, setDeps] = useState({all:[], sub:[]});
    let type = props.match.params.type;
    let noteInfo = useSelector(state => state.mainReducer.noteInfo);
    const getDeps =(type)=>{
        setDeps({all:null, sub:[]});
        axios.post('etalon',{type:type})
        .then(res => {setDeps(res.data)})
        .catch(err => console.log('rrrr', err))
    };
    const dispatch = useDispatch();

    useEffect(()=>{
        getDeps(type);
        dispatch(setEtalonCount({type:false, deps:[]}));
       return function clean(){
            dispatch(setEtalonModal(false));
            dispatch(setEtalonCount({type:false, deps:[]}))
        }
    },[type]);

    return (
        <>
        <Grid container>
            {(type !== 'gosb' && type !== 'tb') && <Redirect to={process.env.REACT_APP_BASE + '/'} />}
            <Grid className={classes.title} xs={12}>
               Типовая структура {type === 'tb' ? 'Аппарат ТБ' : 'ГОСБ'}
            </Grid>
        </Grid>
        <Grid container>
            <Grid item xs={3} className={classes.menuBtn}>
                <MenuButton type={type}/>
            </Grid>
        </Grid>
        {deps.all != null?
            <EtalonStructure type={type} deps={deps.all} subdep={deps.sub} getDeps={getDeps}/> : <Progress/>
        }
        {noteInfo && <FootModalInfo/>}

        </>
    )
}