import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import MoveIcons from './moveIcon';
import { makeStyles } from '@material-ui/core/styles';
import {StructureContext} from './structureContext';
import {useSelector} from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'green',
        color:'white',
        marginLeft: '5px',
        display: 'flex',
        marginTop: '10px',
        flexDirection: 'column',
        fontSize: '1.4vh',
        width:"70%",
        height: '45px',
        alignSelf:'center',
        padding:'5px',
        position:'relative',
    },
    depName: {
        cursor: 'pointer'
    },
}));

export default function DepPart(props) {
    const {
        depname,
        lvl,
        id
    } = props;

    const {allDeps} = useContext(StructureContext);
    const user = useSelector(state => state.mainReducer.user);
    const backGround = {
        1: 'Green',
        2: 'SeaGreen',
        3: 'MediumSeaGreen',
        4: 'DarkCyan',
        5: 'DarkTurquoise',
        6: 'DarkTurquoise',
        7: 'DarkTurquoise',
        8: 'DarkTurquoise'
    }
    const classes = useStyles();


    return (
        <>
            <Grid className={classes.paper} style={{backgroundColor: backGround[lvl], marginLeft: `${lvl*12}px`}} >
                <Grid item>
                    <span
                        className={classes.depName}
                    >
                        {depname ? depname : 'Не найден'}
                    </span>
                    {lvl === 3 && user.role.id === 17 &&
                        <MoveIcons lvl={lvl} id={id} depname={depname}/>
                    }
                </Grid>
            </Grid>
            {lvl > 2 && allDeps.filter(i => id === i.parent).map(i =>
                <DepPart
                    depname={i.depname}
                    lvl={i.lvl}
                    id={i.id}
                    key={i.id}
                />
            )}
        </>
    );
}