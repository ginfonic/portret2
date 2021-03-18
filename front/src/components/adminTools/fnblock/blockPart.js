import React from 'react';
import {Grid} from '@material-ui/core';
import {CompareArrows} from "@material-ui/icons";
import Chip from '@material-ui/core/Chip';
import { makeStyles} from '@material-ui/core/styles';
import FnblockMenu from './fnblockMenu';


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        marginTop: 15,
    },
    title: {
        padding: '5px',
        color: 'green'
    },
    chip: {
        margin: '5px'
    },
    icon: {
        cursor: 'pointer'
    }
}));


export const BlockPart = (props) => {
    const classes = useStyles();
    const {
        block,
        blockData,
        allBlock,
        changeBlock,
        id
    } = props;

    return(
        <Grid container direction="column">
            <Grid item className={classes.title}>
                {block.title}
            </Grid>
            <Grid item>
                {blockData.filter(i => i.type === block.id).map((i, index) => 
                <Chip
                  key={index}
                  label={i.fnblock}
                  className={classes.chip}
                  icon={<FnblockMenu allBlock={allBlock} changeBlock={changeBlock} name={i.fnblock} id={id}/>}
                  ></Chip>
                )}
            </Grid>
        </Grid>
    )
}