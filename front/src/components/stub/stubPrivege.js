import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        minHeight: '600px',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'column'
    },
    icon: {
        color:'red',
        fontSize:'10px'
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Stub() {
    const classes = useStyles();
    const user = useSelector(state => state.mainReducer.user);

    return (
        <Grid container className={classes.root}>
            <Grid className={classes.icon}>
                <ErrorOutlineIcon fontSize='large'/>
            </Grid>
            <Grid>
                У Вас недостаточно прав для просмотра этой страницы
            </Grid>
        </Grid>
    )
}