import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import style from './style.module.css';


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '100%'
    },
    list: {
        fontSize: '0.9em'
    }
}));


export default function UnitList(props){
    const classes = useStyles();
    const {units} = props;
    const count = useSelector(state => state.mainReducer.count);

    return(
        <Grid item className={style.unitList} xs={10}>
            <ul>
                {count === 'state' && units.filter(i => i.statecount != 0).map(i =>
                    <li key={i.id}>
                        <span className={style.liPart}>
                          {i.urm && <span style={{color:'red'}}> УРМ </span>}  {i.position} - {i.statecount} 
                        </span>
                        {i.urm && <span style={{color:'red'}}> {i.city} </span>}
                    </li>
                )}
                {count === 'vacancy' && units.filter(i => i.vacancy).map(i =>
                    <li key={i.id}>
                        <span className={style.liPart}>
                          {i.urm && <span style={{color:'red'}}> УРМ </span>}  {i.position} - {i.vacancy}
                        </span>
                    </li>
                )}
                 {count === 'fact' && units.map(i =>
                    <li key={i.id}>
                        <span className={style.liPart}>
                          {i.urm && <span style={{color:'red'}}> УРМ </span>}  {i.position} - {i.statecount} / {i.stavkacount}
                        </span>
                    </li>
                )}
            </ul>
        </Grid>
    )
}
