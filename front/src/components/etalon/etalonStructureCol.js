import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EtalonPart from './etalonPart';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        backgroundColor: 'green',
        color: 'white',
        borderRadius:'5px',
        marginLeft:'5px'
    },
    subStructure: {
        marginTop:'20px',
        padding:'3px',
        border: '2px gray dashed',
        justifyContent:'center'
    }
}));

export default function EtalonStructureCol(props) {
    const {deps, block, subdep } = props;
    const classes = useStyles();
    const subDep = subdep.filter(i => i.funcblock === block);

    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                {deps.filter(i => (i.lvl===2 && (i.funcblock === block && !i.subpart))).map(i => 
                    <EtalonPart
                    name={i.name}
                    lvl={i.lvl}
                    deps={deps}
                    id={i.id}
                    notes={i.notes}
                    text={i.text}
                    key={i.id}
                    flat={i.flat}
                    block={i.funcblock}
                    subpart={i.subpart}
                    />
                    )
                }
            </Grid>
            {subDep.length > 0 &&
                <Grid container spacing={1} className={classes.subStructure}>
                    <span style={{color:'green'}}>РСЦ</span>
                    {subDep.map(i =>
                        <EtalonPart
                        name={i.name}
                        lvl={i.lvl}
                        deps={deps}
                        id={i.id}
                        notes={i.notes}
                        text={i.text}
                        key={i.id}
                        flat={i.flat}
                        block={i.funcblock}
                        subpart={i.subpart}
                        />
                    )}
                </Grid>
            }
        </div>
    );
}