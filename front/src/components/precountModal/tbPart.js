import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {setEtalonCount} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import ModalItems from './modalItems';
import { Grid } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '100%'
    },
    listItem: {
        cursor: 'pointer',
        color: 'green',
        '&:hover':{
            color: 'gray'
        }
    }
}));


export default React.memo(function(props){
    const classes = useStyles();
    const {data} = props;
    const[openGosb, setOpenGosb] = useState(false)
    const etalonCount = useSelector(state => state.mainReducer.etalonCount);
    const dispatch = useDispatch();

    const checkOrNot =(value)=>{
        let check = etalonCount.deps.indexOf(value)
        if(check === -1){
            return false
        }else{
            return true
        }
    };
    const heandleOpen = () => {
        setOpenGosb(!openGosb)
    }
    const checkBoxHeandler =(value)=>{
        let check = etalonCount.deps.indexOf(value)
        if(check != -1){
            let arr = etalonCount.deps;
            arr.splice(check, 1);
            dispatch(setEtalonCount({type:'gosb', deps: arr}))
        }else{
            let arr = etalonCount.deps;
            arr.push(value);
            dispatch(setEtalonCount({type:'gosb', deps:arr}));
        }
    };


    return (
        <>
            <ListItem className={classes.listItem} onClick={heandleOpen}>
                <ListItemText primary={data.tb}/>
            </ListItem>
            {openGosb &&
                <ModalItems gosbs={data.gosb} checkBoxHeandler={checkBoxHeandler} checkOrNot={checkOrNot}/>
            }
        </>
    )
})