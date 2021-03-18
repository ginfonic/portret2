import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {setDevModal} from '../../../redux/actions';
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import {Close} from "@material-ui/icons";
import axios from "axios";
import List from "@material-ui/core/List";
import SameDep from './sameDep'
import Count from './count'
import Urm from './urm'
import Approved from './approved'
import MatchErr from './errors'
import MatchUnitErr from './errorsUnit'

export default React.memo(function () {
    const dispatch = useDispatch();
    const id = useSelector(state => state.mainReducer.devModal);

    const [deviations, setDeviations] = useState({
        samedep: null, count: null, urm: null, approved: null,
        match_err: null, match_unit_err: null});

    useEffect(()=>{
        if (id !== null) {
            axios.post('deviations/sap_elem', {id}).then(res => {
                console.log(res.data.deviations);
                setDeviations(res.data.deviations);
            }).catch(err => console.log(err))
        }
    },[id]);

    const close = () => {
        dispatch(setDevModal(null));
    };

    return <Dialog open={id !== null} onClose={close} maxWidth={"lg"} fullWidth>
        <MuiDialogTitle disableTypography style={{margin: 0, padding: 10}}>
            <Grid container>
                <Grid item xs={10}>
                    <Typography variant={"h6"}>
                        Отклонения
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={close}>
                        <Close/>
                    </IconButton>
                </Grid>
            </Grid>
        </MuiDialogTitle>
        <DialogContent style={{height: 700}}>
            <List>
                {deviations.samedep !== null &&
                <SameDep same_department={deviations.samedep}/>
                }
                {deviations.count !== null &&
                <Count count={deviations.count}/>
                }
                {deviations.urm !== null &&
                <Urm/>
                }
                {deviations.approved !== null &&
                <Approved approved={deviations.approved}/>
                }
                {deviations.match_err !== null &&
                <MatchErr deviations={deviations} setDeviations={setDeviations} id={id}/>
                }
                {deviations.match_unit_err !== null &&
                <MatchUnitErr deviations={deviations} setDeviations={setDeviations}/>
                }
            </List>
        </DialogContent>
        <DialogActions>
        </DialogActions>
    </Dialog>
})
