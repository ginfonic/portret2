import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import DepPart from './depPart';
import {StructureContext} from './structureContext';

const useStyles = makeStyles((theme) => ({
    mainPart: {
        display: 'flex',
        justifyContent:'center',
        minHeight:"30px",
        maxHeight:'30px',
        textAlign:'center',
        marginBottom:'10px'

    },
    root: {
        marginTop: "20px",
    }
}));

export default function StructureCol(props){
    const {
        colName,
        colNum,
        colData
    } = props;
    const classes = useStyles();
    const {allDeps,assistans} = useContext(StructureContext);

    return(
        <Grid container direction='column' className={classes.root} xs={2}>
            <Grid  className={classes.mainPart}>
                {colName}
            </Grid>

            {colNum !== 5 && colData &&
                <DepPart
                    depname={colData.depname}
                    id={colData.id}
                    lvl={colData.lvl}
                />
            }
            {colNum === 5 && assistans.map(i =>
                 <DepPart
                 depname={i.depname}
                 id={i.id}
                 lvl={2}
                 key={i.id}
                />
                )}
            {allDeps.filter(i => (i.type === colNum && i.lvl === 3)).map(i =>
                <DepPart
                    depname={i.depname}
                    id={i.id}
                    lvl={i.lvl}
                    key={i.id}
                />
            )}
        </Grid>
    )
}