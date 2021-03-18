import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import OutModal from './outModal';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'teal',
        color:'white',
        borderRadius: '5px',
        marginLeft: '5px',
        minHeight: '90px',
        display: 'flex',
        marginTop: '10px',
        position: 'relative',
        flexDirection: 'column',
        fontSize: '1.4vh',
        alignSelf:'center'
    },
    depName: {
        cursor: 'pointer'
    }
}));

export default function OutPart(props) {
    const {
        data,
        depName
    } = props;

    const classes = useStyles();
    const[outModal, setoutModal] = useState(false);
    return (
        <>
            <Grid item xs={10} className={classes.paper}>
                <Grid item>
                    <span
                        className={classes.depName}
                        onClick={() => setoutModal(true)}
                    >
                        {depName} ({data.length})
                    </span>
                </Grid>
                {outModal && <OutModal setoutModal={setoutModal} data={data}/>}
            </Grid>


        </>
    );
}