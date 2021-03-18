import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux';
import {Menu , MenuItem} from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/DateRange';
import axios from 'axios';
import { setDate } from '../../redux/actions';

const useStyles = makeStyles((theme) => ({
    
    icons: {
        cursor:'pointer'
    }
}));

export default function DateIcon(){
    const classes = useStyles();
    const [months, setMonth] = useState(['1221','12122','12121']);
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose =(item)=>{
        setAnchorEl(null);
        if(item.date){
            dispatch(setDate(item.date))
        }
    };

    useEffect(() => {
        if(anchorEl){
            axios.post('initial/alldates').
            then(res => setMonth(res.data))
        }
    },[anchorEl])
    return(
        <div>
            <CalendarIcon fontSize='large' className={classes.icons} onClick={handleClick}/>
            <Menu
                id='date-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {months.map((i, index) =>
                    <MenuItem onClick={() => handleClose({date:i})} key={index} >
                        {i}
                    </MenuItem>
                )}
            </Menu>
        </div>
    )
}