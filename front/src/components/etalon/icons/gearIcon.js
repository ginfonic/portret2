import React, {useState, useEffect} from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { useDispatch } from 'react-redux';
import {setSettingModal} from '../../../redux/actions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        left: 1,
        top: 2,
        color: 'white',
        cursor:'pointer'
    },
    
}));

export default function GearIcon(props){
    
    const classes = useStyles();
    const {id} = props;
    const dispatch = useDispatch();
    const heandleClick = () => {
        dispatch(setSettingModal(id))
    }
    return(
        <div className={classes.root} onClick={heandleClick}>
            <SettingsIcon/>
        </div>
    )
}