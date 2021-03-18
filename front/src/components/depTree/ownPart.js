import React from 'react';
import { Grid } from '@material-ui/core';
import DepTreePart from './depTreePart';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop:'20px',
    },
    mainPart: {
        display: 'flex',
        justifyContent:'space-around',
    }
}));

export default function OwnPart(props){

    const classes = useStyles();
    const {
        own
    } = props;
    return(
        <Grid container direction='row' className={classes.mainPart}>
            {own.filter(i => (i.level === 2 && i.count.statecount != 0)).map(i =>
                <Grid key={i.id} xs={2} direction='column'>
                    <DepTreePart
                        depname={i.depname}
                        count={i.count}
                        level={i.level}
                        id={i.id}
                        dev={i.dev}
                        key={i.id}
                        units={i.units}
                        data={own}
                        connect={i.connect}
                        city={i.city}
                    />
                </Grid>
            )}
        </Grid>
    )
}

