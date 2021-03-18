import React, { useEffect,useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from 'react-redux';
import CountIcon from './icons/countIcon';
import {setVsp} from '../../redux/actions';
import { history } from '../../index';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'teal',
        color:'white',
        borderRadius: '5px',
        marginLeft: '5px',
        minHeight: '90px',
        display: 'flex',
        marginTop: '10px',
        position: 'relative',
        flexDirection: 'column',
        fontSize: '1.4vh',
        alignSelf:'center'
    },
    depName: {
        cursor: 'pointer'
    },
    
}));

export default function DepPart(props) {
    const {
        type,
        dep,
        bank
    } = props;

    const dispatch = useDispatch();

    const date = useSelector(state => state.mainReducer.date);
    const [count, setCount] = useState({statecount:0, stavkacount:0, vacancy:0});
    const classes = useStyles();

    const handleClick = () => {
        if(type === 'kic'){
            dispatch(setVsp({
                bank, date
            }));
            history.push(`${process.env.REACT_APP_BASE}/kic`)
        }
        if(type === 'vsp'){
            dispatch(setVsp({
                bank, date
            }));
            history.push(`${process.env.REACT_APP_BASE}/vsp`)
        }
    };
    useEffect(() => {
        if (type === 'vsp' || type === 'kic') {
            setCount(dep)
        }
        else {
            let obj = {statecount:0, stavkacount:0, vacancy:0};
            for(let i of dep){
                obj.statecount = i.count.statecount + obj.statecount;
                obj.stavkacount = i.count.stavkacount + obj.stavkacount;
                obj.vacancy = i.count.vacancy + obj.vacancy;
            }
            setCount(obj)
        }
    }, [dep]);

    return (
        <>
            <Grid item xs={10} className={classes.paper}>
                <Grid item>
                    <span
                        className={classes.depName}
                        onClick={handleClick}
                    >
                        {type === 'kic' ? 'КИЦ' : 'ВСП'} 
                    </span>
                    {type === 'kic' && <span> {dep.kic_count} шт</span>}
                </Grid>
                {count &&
                    <CountIcon count={count}/>
                }
            </Grid>
        </>
    );
}