import React, {useEffect, useState} from 'react';
import DownMenu from '../downMenu/downMenu';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import DepPart from './depPart';
import Structure from './structure';
import Progress from './progress';
import { makeStyles } from '@material-ui/core/styles';
import EtalonModal from './modals/etalonModal';
import GosbButton from './gosbButton';
import OutstateButton from './outStateButton';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop:'20px',
    },
    mainPart: {
        display: 'flex',
        justifyContent:'center'
    },
    buttonPart: {
        display: 'flex',
        flexDirection:'column',
        justifyContent:'flex-end'
    }
}));

export default function DepMain(props){
    const classes = useStyles();
    const depName = props.match.params.depName.replace(/_/g,' ');
    const dep = props.match.params.dep ? props.match.params.dep.replace(/_/g,' ') : null;
    const date = useSelector(state => state.mainReducer.date);
    const etalModal = useSelector(state => state.mainReducer.etalonModal);
    const [depData, setDepData] = useState(false);

    useEffect(() => {
        setDepData(false);
        axios.post('department', {depName, dep, date})
            .then(res => setDepData(res.data))
            .catch(err => console.log(err))
    }, [depName, dep, date]);

    return(
        <Grid container id='screenShot'>
            <DownMenu depName={dep ? dep : depName}/>
            <Grid container className={classes.root} >
                <Grid item xs={5}/>
                <Grid item xs={2} className={classes.mainPart}>
                    <DepPart
                        depname={(depData && depData.upr) ? depData.upr.depname : null}
                        count={(depData && depData.uprCount) ? depData.uprCount : null}
                        id={(depData && depData.upr) ? depData.upr.id : null}
                        dep={dep}
                        dev={(depData && depData.upr) ? depData.upr.dev : false}
                        dev_child={(depData && depData.upr) ? depData.upr.dev_child : false}
                        depName={depName}
                        connect={(depData && depData.upr) ? depData.upr.connect : null}
                    />
                </Grid>
                <Grid item xs={1} className={classes.buttonPart}>
                    {!dep &&
                        <GosbButton depName={depName}/>
                    }
                </Grid>
                <Grid item xs={2} className={classes.buttonPart}></Grid>
                <Grid item xs={2} className={classes.buttonPart}>
                {!dep && depData &&
                        <OutstateButton outState={depData.out}/>
                    }
                </Grid>
            </Grid>
            {depData ?
                <Structure depData={depData} dep={dep} depName={depName}/>
                :
                <Progress/>
            }
            {etalModal && <EtalonModal/>}
        </Grid>
    )
}