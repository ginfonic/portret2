import React, { useEffect,useState } from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Business';
import { setVsp } from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import DepTreePart from '../depTree/depTreePart';
import OwnPart from '../depTree/ownPart';
import axios from 'axios';
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop:'10px'
    },
    depName: {
        cursor: 'pointer'
    },
    listPart: {
        borderRight: '1px solid green'
    },
    title: {
        textAlign:'center',
        color:'green'
    },
    listItem: {
        cursor: 'pointer',
        color:'black',
        '&:hover':{
            color: 'gray'
        }
    }
}));


export default function KicMain(props){
    const classes = useStyles();
    const [kicData, setKicdata] = useState([]);
    const kic = useSelector(state => state.mainReducer.vsp);
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const date = useSelector(state => state.mainReducer.date);
    const dispatch = useDispatch();

    React.useEffect(() => {
        axios.post('department/kic', {date: kic.date, bank: kic.bank}).then(res => {
            setData(res.data.kic);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
        return function clear(){
            dispatch(setVsp(false))
        }
    }, [kic]);

    const heandleclick =(depId, date)=>{
        axios.post('deptree', {depId, date})
        .then(res => setKicdata(res.data))
        .catch(err => console.log(err))
    };
    
    return(
        <Grid container className={classes.root}>
            <Grid item xs={2} className={classes.listPart}>
                <Grid container direction="column">
                    <Grid item className={classes.title} xs={12}>
                        <span>КИЦ</span>
                        <List dense={true}>
                            {loading &&
                            <LinearProgress/>
                            }
                            {data && data.filter(i => i.count.statecount != 0).map(i =>
                                <ListItem key={i.id} className={classes.listItem} onClick={()=> heandleclick(i.id, date)}>
                                    <ListItemIcon>
                                        <HomeIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={`${i.depname} (${i.count.statecount})`}/>
                                </ListItem>
                            )}
                        </List>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={10}>
            <Grid container className={classes.root}>
                <Grid item xs={5}></Grid>
                <Grid item xs={2} className={classes.mainPart} direction='column'>
                    {kicData.length > 0 && kicData.filter(i => i.level === 1).map(i =>
                        <DepTreePart
                            depname={i.depname}
                            count={i.count}
                            level={i.level}
                            id={i.id}
                            key={i.id}
                            units={i.units}
                            data={kicData}
                            connect={i.connect}
                        />
                    )
                    }
                </Grid>
            </Grid>
            {kicData.length > 0 &&
                <OwnPart own={kicData.filter(i => i.count.statecount != 0)}/>
            }
            </Grid>
        </Grid>
    )
}