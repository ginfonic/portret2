import React from 'react';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        right: 5,
        bottom: 0,
        color: 'white',
        cursor:'pointer'
    },
    
}));

export default function UnitIcon(props){
    const {
        showUnits,
        setShowUnits
    } = props;
    const classes = useStyles();
    return(
        <div className={classes.root} onClick={() => setShowUnits(!showUnits)}>
            <PeopleAltIcon/>
        </div>
    )
}