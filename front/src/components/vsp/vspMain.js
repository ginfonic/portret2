import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import {useSelector, useDispatch} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { setVsp } from '../../redux/actions';
import VspTable from './vspTable';
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop:'10px',
        height:'500px'
    },
}));

export default function VspMain(){
    const classes = useStyles();
    const vsp = useSelector(state => state.mainReducer.vsp);
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();

    useEffect(()=>{
        setLoading(true);
        axios.post('department/vsp', {date: vsp.date, bank: vsp.bank}).then(res => {
            setData(res.data.vsp);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
        return function(){
            dispatch(setVsp(false))
        }
    },[]);

    return(
        <Grid container className={classes.root}>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
                {loading &&
                <LinearProgress/>
                }
                {data && data.length > 0 && <VspTable data={data}/>}
            </Grid>
        </Grid>
    )
}