import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CountIcon from '../depMain/icons/countIcon';
import ConnectIcon from '../depMain/icons/connectIcon';
import UnitList from './unitList/unitList';
import HomeIcon from '../depMain/icons/homeIcon';
import {useDispatch, useSelector} from 'react-redux';
import {setDevModal} from "../../redux/actions";
import DevIcon from "../depMain/icons/devIcon";

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
        width:'100%',
        minHeight: '90px',
        display: 'flex',
        marginTop: '10px',
        position: 'relative',
        flexDirection: 'column',
        fontSize: '1.4vh',
        alignSelf:'center',

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

export default function DepTreePart(props) {
    const {
        depname,
        count,
        level,
        id,
        dev,
        units,
        data,
        connect,
        city
    } = props;
    const backGround = {
        1: 'Green',
        2: 'SeaGreen',
        3: 'MediumSeaGreen',
        4: 'DarkCyan',
        5: 'DarkTurquoise',
        6: 'DarkTurquoise',
        7: 'DarkTurquoise',
        8: 'DarkTurquoise'
    };

    const [show, setCity] = useState(false);
    const classes = useStyles();
    let user = useSelector(state => state.mainReducer.user);
    const showCity = () => {
        setCity(!show)
    };

    return (
        <>
            <Grid item xs={10} className={classes.paper} style={{backgroundColor: backGround[level]}}>
                <Grid item>
                    <span
                        className={classes.depName}
                    >
                        {depname}
                    </span>
                    
                </Grid>
                {dev &&
                <DevIcon id={id}/>
                }
                {count && user.role.id != 0 &&
                    <CountIcon count={count}/>
                }
                {connect && <ConnectIcon id={connect}/>}
                {city && 
                    <HomeIcon showCity={showCity}/>
                }
                {city && show &&
                    <span className={classes.cityPart}>
                        {city}
                    </span>
                }
            </Grid>
            <UnitList units={units}/>
            {level > 1 && data.filter(i => i.parent === id).map(i =>
                <DepTreePart
                depname={i.depname}
                count={i.count}
                level={i.level}
                id={i.id}
                dev={i.dev}
                key={i.id}
                units={i.units}
                data={data}
                connect={i.connect}
            />
            )}
        </>
    );
}