import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        color: "white",
        left: "-15px",
        bottom: "-5px",
        borderRadius: "5px",
        padding: "3px",
        minWidth: "50px",
        textAlign: 'center',
        cursor:'pointer'
    },
    
}));


export default function CountIcon(props){
    const classes = useStyles();
    const {
        showCity
    } = props;

    return(
        <div className={classes.root} onClick={showCity}>
            <HomeIcon />
        </div>
    )
}