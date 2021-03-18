import React, {useState, useEffect} from 'react';
import {Menu , MenuItem} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GosbIcon from '@material-ui/icons/Business';
import { history } from '../../index';
import axios from 'axios';

export default function GosbButton(props){
    const {
        depName
    } = props;
    const [gosb, setGosb] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose =(item)=>{
        setAnchorEl(null);
        if(item.date){
            history.push(`${process.env.REACT_APP_BASE}/dep/${depName}/${item.date}`);
        }
    };

    useEffect(() => {
        if(anchorEl){
            axios.post('deps/getgosb',{depName})
            .then(res => setGosb(res.data))
        }

    },[anchorEl, depName]);

    return(
        <div>
            <Button
                onClick={handleClick}
                startIcon={<GosbIcon/>}
                color="primary"
            >
                 Выбор ГОСБ 
            </Button>
            <Menu
                id='date-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
               {gosb.map((i, index) =>
                    <MenuItem 
                        key={index}
                        onClick={() => handleClose({date:i})}
                    > {i} 
                    </MenuItem>
               )}
            </Menu>
        </div>
    )
}