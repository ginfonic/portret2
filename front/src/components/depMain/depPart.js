import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CountIcon from './icons/countIcon';
import HomeIcon from './icons/homeIcon';
import ConnectIcon from './icons/connectIcon';
import DevIcon from './icons/devIcon';
import DevChild from './icons/devChild';
import { history } from '../../index';
import {useSelector} from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'green',
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
    cityPart: {
        position:'absolute',
        top:-2,
        backgroundColor:'cyan',
        color:'black',
        padding:'3px'
    }
}));

export default function DepPart(props) {
    const {
        depname,
        count,
        id,
        dev,
        dev_child,
        dep,
        depName,
        connect,
        city
    } = props;
    //const backGround = {
    //    1: 'Green',
    //    2: 'SeaGreen',
    //    3: 'MediumSeaGreen',
    //    4: 'DarkCyan',
    //    5: 'DarkTurquoise',
    //    6: 'DarkTurquoise',
    //    7: 'DarkTurquoise',
    //    8: 'DarkTurquoise'
    //};
    const [show, setCity] = useState(false);
    const classes = useStyles();
    let user = useSelector(state => state.mainReducer.user);

    const showCity = () => {
        setCity(!show)
    };

    const treePart = () =>{
        if(dep){
            history.push(`${process.env.REACT_APP_BASE}/deptree/${depName}/${dep}/${id}`)
        }else{
            history.push(`${process.env.REACT_APP_BASE}/deptree/${depName}/${id}`) 
        }
    };

    return (
        <>
            <Grid item xs={10} className={classes.paper}>
                <Grid item>
                    <span
                        className={classes.depName}
                        onClick={treePart}
                    >
                        {depname ? depname : 'Не найден'}
                    </span>
                </Grid>
                {dev &&
                <DevIcon id={id}/>
                }
                {dev_child &&
                <DevChild/>
                }
                {count && user.role.id !== 0 &&
                    <CountIcon count={count}/>
                }
                {connect &&
                    <ConnectIcon id={connect}/>
                }
                {city && 
                    <HomeIcon showCity={showCity}/>
                }
                {city && show &&
                    <span className={classes.cityPart}>
                        {city}
                    </span>
                }
            </Grid>


        </>
    );
}