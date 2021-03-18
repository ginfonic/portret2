import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import FootSetModal from './footSetModal';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        borderBottom: '1px solid gray',
        flexDirection: 'column'
    },
    menuBtn: {
        alignSelf: 'flex-end'
    },
    foot:{
        color:'rgb(16, 16, 192)',
        cursor:'pointer'
    }
}));

export default function FootNotes(props) {
    const classes = useStyles();

    const {
        id,
        type
    } = props;

    const [notes, setNotes] = useState([]);
    const [footModal, setFootModal] = useState(false);

    const getNotes = (id, type) => {
        axios.post('etalon/getnotes', {id, type})
        .then(res => setNotes(res.data))
        .catch(err => console.log(err))
    }
    useEffect(()=>{
        getNotes(id, type)
    },[])
    return (
        <Grid container>
            <Grid item>
                <span
                    className={classes.foot}
                    onClick={() => setFootModal(true)}
                >
                Сноски:
                </span>
                {notes.map((i, index) => 
                <span
                    key={index}
                > {i.num} /</span>, '|'
            )}
            </Grid>
            {footModal && 
                <FootSetModal
                    setFootModal={setFootModal}
                    id={id}
                    type={type}
                    propNotes={notes}
                    propSetNotes={setNotes}
                    getNotes={getNotes}
                />}
        </Grid>
    )
}
