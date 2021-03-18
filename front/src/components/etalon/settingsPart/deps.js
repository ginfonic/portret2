import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BusinessIcon from '@material-ui/icons/Business';
import FootNotes from '../footNotes';
import DepsModal from '../settingsPart/depsModal';
import AddDepModal from '../settingsPart/depsAddModal';
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


  export default function Deps(props){
    
    const classes = useStyles();
    const { id, parentId, funcblock, lvl } = props;
    const [deps, setDeps] = useState([]);
    const [depsModal, setDepsModal] = useState(false);
    const [addDep, setAddModal] = useState(false);
    const getDeps = (id) => {
        axios.post('etalon/getdeps', {id:id})
        .then(res => setDeps(res.data))
        .catch(err => console.log(err))
    }
    useEffect(()=>{
        getDeps(id)
    },[])
      return(
        <Grid container direction='column' className={classes.root}>
            <Grid item>
                <span className={classes.title}>Подразделения в подчинении:</span>
                <List dense={true}>
                  {deps.length > 0 &&
                    deps.map(i =>
                      <ListItem key={i.id} >
                        <ListItemIcon>
                          <BusinessIcon className={classes.unitIcon} onClick={() => setDepsModal(i)}/>
                        </ListItemIcon>
                        <Grid container direction='column' spacing={1}>
                          <Grid item>
                            <span className={classes.name}>{i.name}</span>
                          </Grid>
                          <Grid item>
                            <FootNotes id={i.id} type='dep'/>
                          </Grid>
                        </Grid>
                      </ListItem>
                    )
                  }
                </List>
            </Grid>
            <Grid item>
                <Button
                  color="primary"
                  onClick={() => setAddModal(true)}
                >
                  Добавить подразделение
                </Button>  
            </Grid>
            {depsModal &&
             <DepsModal 
                depsModal={depsModal}
                idDep={id}
                setDepsModal={setDepsModal}
                getDeps={getDeps}
                parentId={parentId}
                funcblock={funcblock}
                lvl={lvl}
            />}
            {addDep &&
                <AddDepModal
                    depsModal={depsModal}
                    idDep={id}
                    setAddModal={setAddModal}
                    parentId={parentId}
                    getDeps={getDeps}
                />
            }
        </Grid>
      )
  }