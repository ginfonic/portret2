import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/DoneOutline';
import { useDispatch } from 'react-redux';
import { setEtalonModal } from '../../../redux/actions';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        color: "white",
        right: "-15px",
        top: "-5px",
        borderRadius: "5px",
        padding: "3px",
        minWidth: "50px",
        textAlign: 'center',
        cursor:'pointer'
    },
    
}));


export default function ConnectIcon(props){
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const {
        id
    } = props;

    const heandleDispatch = () => {
        dispatch(setEtalonModal(id))
    }
    return(
        <div className={classes.root} onClick={heandleDispatch}>
            <DoneIcon />
        </div>
    )
}