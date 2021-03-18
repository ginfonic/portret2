import React from 'react';
import Grid from '@material-ui/core/Grid';
import mapImg from './map.png';
import style from './style.module.css';

export default function Map() {

    return (
        <Grid container className={style.map}>
            <img src={process.env.REACT_APP_BASE+mapImg} alt='map' className='img-fluid' width='1280'></img>
        </Grid>
    )
}