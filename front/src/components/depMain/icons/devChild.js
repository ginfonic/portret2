import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {ErrorOutline} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        color: "white",
        left: "25px",
        top: "0px",
        borderRadius: "5px",
        padding: "3px",
        minWidth: "50px",
        textAlign: 'center',
        cursor:'pointer'
    },
}));


export default function DevIcon(props){
    const classes = useStyles();

    return(
        <div className={classes.root}>
            <Tooltip title={'В нижестоящих подразделениях есть отклонения'}>
                <ErrorOutline/>
            </Tooltip>
        </div>
    )
}