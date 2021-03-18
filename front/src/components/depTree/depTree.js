import React, {useEffect, useState} from 'react';
import DownMenu from '../downMenu/downMenu';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DepTreePart from './depTreePart';
import BreadCrumb from './breadCrumb';
import OwnPart from './ownPart';
import EtalonModal from '../depMain/modals/etalonModal';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop:'20px',
    },
    mainPart: {
        display: 'flex',
        justifyContent:'center'
    }
}));

export default function DepTree(props){
    const classes = useStyles();
    const {dep, depName} = props.match.params;
    const date = useSelector(state => state.mainReducer.date);
    const etalModal = useSelector(state => state.mainReducer.etalonModal);
    const [data, setData] = useState([]);
    const [depId, setDepId] = useState(props.match.params.id);

    useEffect(() => {
        axios.post('deptree', {depId, date})
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    },[depId]);
    
    return(
        <Grid container id='screenShot'>
            <DownMenu/>
            <BreadCrumb dep={dep} depName={depName} depId={depId} setDepId={setDepId}/>
            <Grid container className={classes.root}>
                <Grid item xs={5}></Grid>
                <Grid item xs={2} className={classes.mainPart} direction='column'>
                    {data.length > 0 && data.filter(i => i.level === 1).map(i =>
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
                            city={i.city}
                        />
                    )
                    }
                </Grid>
            </Grid>
            {data.length > 0 &&
                <OwnPart own={data}/>
            }
            {etalModal && <EtalonModal/>}
        </Grid>
    )
}