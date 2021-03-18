import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DepPart from './depPart';
import VspPart from './vspPart';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';

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
    mainPart: {
        display: 'flex',
        justifyContent:'center',
        width: '100%',
    }
}));

export default function StructureCol(props){
    const classes = useStyles();
    const { depData, num, dep, depName} = props;
    const user = useSelector(state => state.mainReducer.user);

    return(
        <Grid container direction='column'>
            <Grid className={classes.mainPart}>
                {num !== 5 &&
                <DepPart
                    depname={depData[num].zam ? depData[num].zam.depname : null }
                    lvl={depData[num].zam ? depData[num].zam.lvl : null}
                    count = {depData[num].count ? depData[num].count : null}
                    id={depData[num].zam ? depData[num].zam.id : null}
                    dev={depData[num].zam ? depData[num].zam.dev : false}
                    dev_child={depData[num].zam ? depData[num].zam.dev_child : false}
                    dep={dep}
                    depName={depName}
                    connect={depData[num].zam ? depData[num].zam.connect : null}
                />
                }
                {num === 5 &&
                <DepPart
                    depname={'Подразделения прямого подчинения'}
                    count = {depData[num].count ? depData[num].count : null}
                    lvl={depData[num].zam ? depData[num].zam.lvl : null}
                    id={depData[num].zam ? depData[num].zam.id : null}
                    dev={depData[num].zam ? depData[num].zam.dev : false}
                    dev_child={depData[num].zam ? depData[num].zam.dev_child : false}
                    dep={dep}
                    depName={depName}
                    connect={depData[num].zam ? depData[num].zam.connect : null}
                />
                }
            </Grid>
            {num === 5 && depData.assistant.length > 0 &&
            depData.assistant.map((i, index) =>
                <Grid key={`${index}-1`} className={classes.mainPart}>
                    <DepPart
                        depname={i.depname}
                        key={i.key}
                        count={i.count}
                        id={i.id}
                        dev={i.dev}
                        dev_child={i.dev_child}
                        dep={dep}
                        depName={depName}
                        connect={i.connect}
                    />
                </Grid>
            )
            }
            {num === 5 && depData[num].own.map((i, index) =>
                <Grid key={`${index}-2`} className={classes.mainPart}>
                    <DepPart
                        depname={i.depname}
                        count={i.count}
                        id={i.id}
                        dev={i.dev}
                        dev_child={i.dev_child}
                        dep={dep}
                        depName={depName}
                        connect={i.connect}
                        city={i.city}
                    />
                </Grid>
            )}
            {num !== 5 && depData[num].own
                .filter(i => (i.type === 'gosb' ||i.type ==='head' || i.type === 'tb'))
                .map((i, index) =>
                <Grid key={`${index}-3`} className={classes.mainPart}>
                    {i.count.statecount !== 0 &&
                    <DepPart
                        depname={i.depname}
                        count={i.count}
                        id={i.id}
                        dev={i.dev}
                        dev_child={i.dev_child}
                        dep={dep}
                        depName={depName}
                        connect={i.connect}
                        city={i.city}
                    />
                    }
                </Grid>
            )}
            {num === 4 && depData[num].kic !== null && user.role.id !==0 &&
            <Grid  className={classes.mainPart}>
                <VspPart type={'kic'} dep={depData[num].kic} bank={dep === null ? depName : dep}/>
            </Grid>
            }
            {num === 1 && depData[num].vsp !== null && user.role.id !==0 &&
            <Grid  className={classes.mainPart}>
                <VspPart type={'vsp'} dep={depData[num].vsp} bank={dep === null ? depName : dep}/>
            </Grid>
            }
        </Grid>
    )
}
