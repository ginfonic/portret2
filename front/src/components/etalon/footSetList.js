import React from 'react';
import {Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
      borderBottom: '1px solid gray',
      marginBottom: '10px',
      paddingBottom:'10px',
    },
    textNote: {
        fontSize:'0.8em'
    },
    headerStyle: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    }
  }));

  export default function FootSetList(props){
    const classes = useStyles();
    const {
        num,
        text,
        type,
        noteId,
        checkNotes,
        propNotes,
        changeNote,
        depId,
        getNotes
    } = props;

    const createMarkup = (text) => {
        return { __html:text };
    };

    return(
        <Grid container className={classes.root}>
            <Grid item className={classes.headerStyle}>
                <span style={{color:'green'}}>№ {num}</span>
                <input
                    type='checkbox'
                    checked={checkNotes(num)}
                    onChange={() => changeNote(type,noteId,depId, checkNotes(num))}
                ></input>
            </Grid>
            <Grid item className={classes.textNote}>
                <span dangerouslySetInnerHTML={createMarkup(text)}></span>
            </Grid>
        </Grid>
    )
  }