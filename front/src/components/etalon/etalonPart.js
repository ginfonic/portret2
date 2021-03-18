import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import OwnIcon from './icons/ownIcon';
import UnitIcon from './icons/unitIcon';
import GearIcon from './icons/gearIcon';
import UnitList from './unitList';
import InfoIcon from './icons/infoIcon';
import CountIcon from './icons/countIcon';
import { SetNoteInfo } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
        textAlign: 'center',
        color: 'white',
        borderRadius: '5px',
        marginLeft: '5px',
        minHeight: '90px',
        display: 'flex',
        marginTop: '10px',
        position: 'relative',
        flexDirection: 'column',
        fontSize: '1.4vh',
    },
    titlePart: {
        cursor: 'pointer'
    }
}));

export default function EtalonPart(props) {
    const {
        lvl,
        id,
        name,
        deps,
        notes,
        text,
        flat,
        block,
        subpart
    } = props;
    const [showOwn, setShowOwn] = useState(false);
    const [showUnits, setShowUnits] = useState(false);
    const [ownCount, setOwnCount] = useState(0);
    const dispatch = useDispatch();
    const etalonCount = useSelector(state => state.mainReducer.etalonCount);

    const modalNote = (obj) => {
        if(notes.length > 0){
            dispatch(SetNoteInfo(obj))
        }
    };
    const backGround = {
        1: 'Green',
        2: 'SeaGreen',
        3: 'MediumSeaGreen',
        4: 'DarkCyan',
        5: 'DarkTurquoise',
        6: 'DarkTurquoise',
        7: 'DarkTurquoise',
        8: 'DarkTurquoise'
    };

    let own = deps.filter(i => i.parentid === id);
    const classes = useStyles();
    const user = useSelector(state => state.mainReducer.user);
    const superSum = (num) => {
        setOwnCount(ownCount + num)
    };

    return (
        <>
            <Grid item xs={12} className={classes.paper} style={{ backgroundColor: backGround[lvl], border: flat ? '3px green dashed' :null }}>
                <Grid item onClick={() => modalNote({name:name, arr:notes, type:'dep'})} className={classes.titlePart}>
                    {name} {notes.length > 0 ? <span>*</span> : null}
                </Grid>
                <Grid item >
                    {text && text.length > 0 && <InfoIcon id={id}/>}
                </Grid>
                {etalonCount.deps.length > 0 &&
                    <CountIcon id={id}/>
                }
                {own.length > 0 && lvl > 2 && block != 'Прямое подчинение' &&
                    < OwnIcon
                        showOwn={showOwn}
                        setShowOwn={setShowOwn}
                    />
                }
                {own.length > 0 && lvl > 2 && block != 'Прямое подчинение' &&
                    < OwnIcon
                        showOwn={showOwn}
                        setShowOwn={setShowOwn}
                    />
                }
                {own.length > 0  && block === 'Прямое подчинение' &&
                    < OwnIcon
                        showOwn={showOwn}
                        setShowOwn={setShowOwn}
                    />
                }
                <UnitIcon
                    showUnits={showUnits}
                    setShowUnits={setShowUnits}
                />
                {user.role.id === 17 &&
                    <GearIcon id={id} superSum={superSum}/>
                }
            </Grid>

            {showUnits && 
                <UnitList id={id}/>
            }

            {own.length > 0 && lvl === 2  && block != 'Прямое подчинение' &&
                own.map(i =>
                    <EtalonPart
                        key={i.id}
                        id={i.id}
                        name={i.name}
                        lvl={i.lvl}
                        text={i.text}
                        deps={deps}
                        notes={i.notes}
                        flat={i.flat}
                        subpart={i.subpart}
                    />
                )
            }
            {own.length > 0 && lvl > 2 && showOwn &&
                own.map(i =>
                    <EtalonPart
                        key={i.id}
                        id={i.id}
                        name={i.name}
                        lvl={i.lvl}
                        text={i.text}
                        deps={deps}
                        notes={i.notes}
                        flat={i.flat}
                        subpart={i.subpart}
                    />
                )
            }
            {own.length > 0 && block === 'Прямое подчинение' && showOwn &&
                own.map(i =>
                    <EtalonPart
                        key={i.id}
                        id={i.id}
                        name={i.name}
                        lvl={i.lvl}
                        text={i.text}
                        deps={deps}
                        notes={i.notes}
                        flat={i.flat}
                        subpart={i.subpart}
                    />
                )
            }
        </>
    );
}