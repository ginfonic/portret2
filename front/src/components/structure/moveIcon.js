import React, {useState, useEffect} from 'react';
import CompareIcon from '@material-ui/icons/CompareArrows';
import { makeStyles } from '@material-ui/core/styles';
import MoveModal from './moveModal';

const useStyles = makeStyles((theme) => ({
    root: {
        position:'absolute',
        left:'-26px',
        top:'20px',
        color: 'green',
        cursor:'pointer'
    },
}));

export default function MoveIcons(props){
    const classes = useStyles();
    const {
        lvl,
        id,
        depname
    } = props;

    const [modal, setModal] = useState(false);

    return(
        <>
        <div className={classes.root} onClick={() => setModal(true)}>
            <CompareIcon/>
        </div>
        {modal && <MoveModal setModal={setModal} depname={depname} id={id} />}
        </>
    )
}