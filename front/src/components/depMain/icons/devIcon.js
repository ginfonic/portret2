import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch} from 'react-redux';
import {setDevModal} from "../../../redux/actions";
import {Error} from "@material-ui/icons";
import Fab from "@material-ui/core/Fab";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        color: "white",
        left: "-10px",
        top: "-10px",
        borderRadius: "5px",
        padding: "3px",
        minWidth: "50px",
        textAlign: 'center',
        cursor:'pointer'
    },
}));


export default function DevIcon(props){
    const classes = useStyles();

    const {id} = props;

    const dispatch = useDispatch();

    const setDeviation = () => {
        dispatch(setDevModal(id))
    };

    return(
        <div className={classes.root}>
            <Fab onClick={() => setDeviation()} color={"primary"} size={"small"}>
                <Error/>
            </Fab>
        </div>
    )
}