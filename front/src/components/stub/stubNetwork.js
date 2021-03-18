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
        flexDirection: 'column'
    },
    icon: {
        color: 'red',
        fontSize: '10px'
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Stub(props) {
    const classes = useStyles();
    const user = useSelector(state => state.mainReducer.user);
    const err = props.match.params.problem;

    return (
        <Grid container className={classes.root}>
            {user && <Redirect to={process.env.REACT_APP_BASE+'/'} />}
            <Grid className={classes.icon}>
                <ErrorOutlineIcon fontSize='large' />
            </Grid>
            <Grid>
                {err === 'network' &&
                    'Нет связи с сервером'
                }
                {err === 'user' &&
                    'Ошибка авторизации'

                }
                {err === 'notfound' &&
                    'Страница или файл не найдены'

                }
            </Grid>
            <Grid>
                Просьба сообщить о проблеме: 
                <span style ={{color:'blue'}}>
                     panferov.a.ale@omega.sbrf.ru
                </span>
            </Grid>
            <Grid>
            </Grid>
        </Grid>
    )
}