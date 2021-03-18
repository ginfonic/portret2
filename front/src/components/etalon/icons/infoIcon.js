import React, {useState, useEffect} from 'react';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { setDescriptionModal } from '../../../redux/actions';


const useStyles = makeStyles((theme) => ({
    root: {
        color: 'white',
        cursor:'pointer',
        marginTop:'5px'
    },
    
}));

export default function GearIcon(props){
    const classes = useStyles();
    const {
        id
    } = props;
    const dispatch = useDispatch();
    const headleClick = (id) => {
        dispatch(setDescriptionModal(id))
    }
    return(
        <div className={classes.root} onClick={() => headleClick(id)}>
            <InfoIcon fontSize="small"/>
        </div>
    )
}