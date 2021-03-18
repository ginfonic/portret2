import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, Grid, TextField} from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
      color: 'green'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid green',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: '100px',
    width: '400px',
  },
  menuBtn: {
    alignSelf: 'flex-end'
  },
  selectItem:{
    minWidth:'400px',
    maxWidth:'400px'
  }
}));

export default function DepsModal(props) {

  const classes = useStyles();
  const { 
      setDepsModal,
      idDep,
      getDeps
    } = props;
    const {
      id,
      name,
    } = props.depsModal;

  const [open, setOpen] = useState(true);
  const [depName, setName] = useState(name);
  const handleClose = () => {
    setDepsModal(false)
  };

  const depUpdate = (id, name) =>{
      axios.post('etalon/updatedep', {id, name:depName})
      .then(res => { getDeps(idDep); handleClose()})
      .catch(err => console.log(err))
  }

  const userDelete = (id) => {
      axios.post('etalon/deldep', {id})
      .then(res => {getDeps(idDep); handleClose()})
      .catch(err => console.log(err))
  }
 

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h3 className={classes.name}>Редактировать подразделение</h3>
                <Grid container direction='column' spacing={2} >
                    <Grid item>
                        <TextField
                            className={classes.selectItem}
                            value={depName}
                            onChange={e => setName(e.target.value)}
                            variant='outlined'
                            label='Название'
                        />
                    </Grid>
                    <Grid item className={classes.menuBtn}>
                        <Button onClick={() => depUpdate(id, depName)}>Сохранить</Button>
                        <Button onClick={() => userDelete(id)}>Удалить</Button>
                    </Grid>
                </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}