import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        right: -15,
        top: 2,
        color: 'green',
        backgroundColor: 'white',
        border: "1px solid gray",
        borderRadius: "5px",
        padding: "3px",
        minWidth: "50px",
        textAlign: 'center',
    },
    
}));

export default function CountIcon(props){
    const {
        id
    } = props;
    const classes = useStyles();
    const [count, setCount] = useState(0);
    const etalonCount = useSelector(state => state.mainReducer.etalonCount);
    const etalonObj = useSelector(state => state.mainReducer.etalonObj);

    return(
        <div className={classes.root}>
            {etalonObj ? etalonObj[`${id}`] : 0}
        </div>
    )
}