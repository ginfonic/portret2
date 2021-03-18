import React from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        color: 'cyan',
        cursor:'pointer'
    },
    
}));

export default function OwnIcon(props){
    const {
        showOwn,
        setShowOwn
    } = props;
    const classes = useStyles();
    return(
        <div className={classes.root} onClick={() => setShowOwn(!showOwn)}>
            {showOwn ?
                <KeyboardArrowUpIcon/>
                :
                <KeyboardArrowDownIcon/>
            }
        </div>
    )
}