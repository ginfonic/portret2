import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        color: "black",
        right: "-10px",
        bottom: "-3px",
        backgroundColor: 'white',
        border: "1px solid gray",
        borderRadius: "5px",
        padding: "3px",
        minWidth: "50px",
        textAlign: 'center',
    },
    
}));


export default function CountIcon(props){
    const classes = useStyles();

    const {
        statecount,
        stavkacount,
        vacancy
    } = props.count;
    const count = useSelector(state => state.mainReducer.count)
    return(
        <div className={classes.root}>
            {count === 'state' && <span>{statecount}</span>}
            {count === 'fact' && <span>{statecount}/{stavkacount}</span>}
            {count === 'vacancy' && <span>{vacancy}</span>}
        </div>
    )
}