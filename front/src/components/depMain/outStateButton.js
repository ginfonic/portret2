import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Menu , MenuItem} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { history } from '../../index';
import OutModal from './outModal';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    
    icons: {
        cursor:'pointer'
    }
}));

export default function GosbButton(props){
    const {
        depName,
        outState
    } = props;
    const classes = useStyles();
    const [outModal, setoutModal] = useState({show:false, num:2});
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
    const direction = {
        1: outState.filter(i => i.fnblock === 1),
        2: outState.filter(i => i.fnblock === 2),
        3: outState.filter(i => i.fnblock === 3),
        4: outState.filter(i => i.fnblock === 4),
        5: outState.filter(i => i.fnblock === 5),
    }
    useEffect(() => {
        if(anchorEl){
        }

    },[anchorEl])

    return(
        <div>
            <Button
                onClick={handleClick}
                startIcon={<AccountCircleIcon/>}
                color="primary"
                variant="outlined"
            >
                 Заштатные сотрудники
            </Button>
            <Menu
                id='date-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {direction[1].length > 0 &&
                 <MenuItem onClick={() => setoutModal({show: true, num:1})}>Блок Розничный блок и Сеть продаж ({direction[1].length})</MenuItem>
                }
                {direction[2].length > 0 &&
                 <MenuItem  onClick={() => setoutModal({show: true, num:2})}>Блок Корпоративно-инвестиционный бизнеc ({direction[2].length})</MenuItem>
                }
                {direction[3].length > 0 &&
                 <MenuItem  onClick={() => setoutModal({show: true, num:3})}>Блок Работа с ПА и правовые вопросы ({direction[3].length})</MenuItem>
                }
                {direction[4].length > 0 &&
                 <MenuItem  onClick={() => setoutModal({show: true, num:4})}>Региональный сервисный центр ({direction[4].length})</MenuItem>
                }
                {direction[5].length > 0 &&
                 <MenuItem  onClick={() => setoutModal({show: true, num:5})}>Подразделения прямого подчинения управляющему ({direction[5].length})</MenuItem>
                }
                {outState.length === 0 &&
                  <MenuItem>Нет заштатных сотрудников</MenuItem>
                }
            </Menu>
            {outModal.show && <OutModal setoutModal={setoutModal} data={outState.filter(i => i.fnblock === outModal.num)}/>}
        </div>
    )
}