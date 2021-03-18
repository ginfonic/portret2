/* eslint-disable no-use-before-define */
import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Grid, Button} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete/index';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    title: {
        color: 'green',
        marginBottom:'10px',
        marginTop: '10px'
    },
    buttons: {
        alignSelf: 'flex-end',
        marginTop:'10px'
    }
}));

export default function ComboBox(props) {
    const {
        type,
        depId,
        handleClose
    } = props;

    const classes = useStyles();
    const [choose, setChoose] = useState({id:'', name:''});
    const [deps, setDeps] = useState([]);
    const changeParent =()=>{
        axios.post('etalon/changeparent', {parentId: choose.id, depID: depId, type:type})
        .then(res => {handleClose(depId)})
        .catch(err => console.log(err))
    }
    useEffect(()=>{
        axios.post('etalon/getalldeps', {type, depId})
        .then(res => setDeps(res.data))
        .catch(err => console.log(err))
    },[])

  return (
    <Grid container direction='column'>
    <Grid item className={classes.title}>
       <span>Выбор родительского подразделения</span>
    </Grid>
    <Grid item>
        <Autocomplete
        id="combo-box-demo"
        options={deps}
        getOptionLabel={(option) => option.name + ' lvl' + option.lvl}
        style={{ width: '100%' }}
        onChange={(e, newValue) => { newValue === null ? setChoose({id:'', name:''}) : setChoose(newValue)}}
        renderInput={(params) => <TextField {...params} label="Выбор родителя" variant="outlined" />}
        />
        }
    </Grid>
    <Grid item>
        {choose.id.length > 0 &&
            <Button onClick={changeParent}>
                Переподчинить
            </Button>
        }
        <Button onClick={handleClose}>Закрыть</Button>
    </Grid>
    </Grid>
  );
}



