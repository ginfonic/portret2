import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import {setEtalonObj, SetNoteInfo} from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from "@material-ui/core/Tooltip";
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '100%'
    },
    listItem: {
        cursor: 'pointer',
        '&:hover':{
            color: 'gray'
        }
    }
}));

export default function UnitList(props){
    const {id} = props;
    const classes = useStyles();
    const [units, setUnits] = useState([]);
    const dispatch = useDispatch();
    const etalonCount = useSelector(state => state.mainReducer.etalonCount);
    const showColor = useSelector(state => state.mainReducer.showColors);
    const colorMain = useSelector(state => state.mainReducer.colorMain);
    const colorEx = useSelector(state => state.mainReducer.colorEx);
    const modalNote = (obj) => {
        if(obj.arr){
            dispatch(SetNoteInfo(obj))
        }
    };

    useEffect(() => {
        axios.post('etalon/getunits', {id, deps: etalonCount.deps})
        .then(res => setUnits(res.data))
        .catch(err => setUnits([]))
     }, [etalonCount.deps.length]);

    return(
        <Grid item className={classes.root}>
            <List dense={true}>
                {units.length > 0 &&
                    units.map(i =>
                    <ListItem key={i.id} className={classes.listItem} onClick={() => modalNote({name:i.name, arr:i.notes, type:'unit'})}>
                        <ListItemIcon>
                            <Tooltip arrow title={`Основная категория: ${colorMain[i.color].name}`}>
                                <AccountCircleIcon style={{color: showColor ? colorMain[i.color].color : null}}/>
                            </Tooltip>
                            {showColor &&
                            <Tooltip arrow title={`Доп.категория: ${colorEx[i.color_ex].name}`}>
                                <AccountBoxIcon style={{color: colorMain[i.color_ex].color}}/>
                            </Tooltip>
                            }
                        </ListItemIcon>
                        <ListItemText primary={i.name}/>
                        <ListItemIcon>
                            {i.notes &&<span>*</span>}
                        </ListItemIcon>
                        {i.count !== null &&
                        <ListItemIcon>
                            {i.count}
                        </ListItemIcon>}
                    </ListItem>
                        )
                }
                
            </List>
        </Grid>
    )
}