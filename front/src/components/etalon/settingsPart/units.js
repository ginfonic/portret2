import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useSelector} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FootNotes from '../footNotes';
import UnitsModal from './unitsModal';
import UnitsAddModal from './unitsAddModal';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop:'20px'
    },
    title:{
        color:'green'
    },
    menuBtn: {
      alignSelf: 'flex-end'
    },
    name: {
      textDecoration:'underline',
      color:'green'
    },
    unitIcon:{
      cursor:'pointer'
    }
  }));


  export default function Units(props){
    
    const classes = useStyles();
    const { id } = props;
    const [units, setUnits] = useState([]);
    const [unitModal, setUnitModal] = useState(false);
    const [unitAddModal, setUnitAddModal] = useState(false)
    const color = useSelector(state => state.mainReducer.colorMain);
    const getUnits = (id) => {
        axios.post('etalon/getunits', {id:id})
        .then(res => setUnits(res.data))
        .catch(err => console.log(err))
    }
    useEffect(()=>{
      getUnits(id)
    },[])
      return(
        <Grid container direction='column' className={classes.root}>
            <Grid item>
                <span className={classes.title}>Должности:</span>
                <List dense={true}>
                  {units.length > 0 &&
                    units.map(i =>
                      <ListItem key={i.id} >
                        <ListItemIcon>
                          <AccountCircleIcon className={classes.unitIcon} onClick={()=> setUnitModal(i)}/>
                        </ListItemIcon>
                        <Grid container direction='column' spacing={1}>
                          <Grid item>
                            <span className={classes.name}>{i.name}</span>
                          </Grid>
                          <Grid item>
                           Категория: <span style={{color:color[i.color].color}}>{color[i.color].name}</span>
                          </Grid>
                          <Grid item>
                            <FootNotes id={i.id} type='unit'/>
                          </Grid>
                        </Grid>
                      </ListItem>
                    )
                  }
                </List>
            </Grid>
            {unitModal && 
              <UnitsModal
                setUnitModal={setUnitModal}
                unitModal={unitModal}
                idDep={id}
                getUnits={getUnits}
              />
            }
            <Grid item>
                <Button
                  startIcon={<AccountCircleIcon/>}
                  color="primary"
                  onClick={() => setUnitAddModal(true)}
                >
                  Добавить должность
                </Button>  
            </Grid>
            {unitAddModal && <UnitsAddModal setUnitAddModal={setUnitAddModal} getUnits={getUnits}  idDep={id}/>}
        </Grid>
      )
  }