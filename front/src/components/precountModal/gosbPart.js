import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {setEtalonCount} from '../../redux/actions';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '100%'
    },
    listItem: {
        cursor: 'pointer',
        color: 'green',
        '&:hover': {
            color: 'gray'
        }
    }
}));

export default function GosbPart(props) {
    const classes = useStyles();
    const { data } = props;
    const etalonCount = useSelector(state => state.mainReducer.etalonCount);
    const dispatch = useDispatch();

    const checkOrNot = (value) => {
        let check = etalonCount.deps.indexOf(value)
        if (check === -1) {
            return false
        } else {
            return true
        }
    };
    const checkBoxHeandler = (value) => {
        let check = etalonCount.deps.indexOf(value)
        if (check != -1) {
            let arr = etalonCount.deps;
            arr.splice(check, 1);
            dispatch(setEtalonCount({ type: 'gosb', deps: arr }))
        } else {
            let arr = etalonCount.deps;
            arr.push(value);
            dispatch(setEtalonCount({ type: 'gosb', deps: arr }));
        }
    };


    return (
        <Grid item>

        <FormControl component='fieldset' className={classes.formControl}>
            <FormLabel component='legend' style={{ color: 'green' }}> Выбор ТБ для отображения численности:</FormLabel>
            {data.map((i,index) =>

                <FormControlLabel
                    key={index}
                    value={i}
                    control={
                        <Checkbox
                            checked={checkOrNot(i)}
                            onChange={e => checkBoxHeandler(e.target.value)}
                            style={{
                                color: 'green',
                                padding: '0px',
                            }}
                        />
                    }
                    label={i}
                />

            )}

        </FormControl>
        </Grid>
    )
}