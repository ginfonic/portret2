import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
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
    minHeight: '300px',
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

export default function UnitsModal(props) {

  const classes = useStyles();
  const { 
      setUnitModal,
      idDep,
      getUnits
    } = props;
    const {
      id,
      name,
      color,
      color_ex,
    } = props.unitModal
  const [open, setOpen] = useState(true);
  const [unitName, setUnitName] = useState(name);
  const [unitColor, setUnitColor] = useState(color);
  const [unitColorEx, setUnitColorEx] = useState(color_ex);
  const colors = useSelector(state => state.mainReducer.colorMain);
  const colors_ex = useSelector(state => state.mainReducer.colorEx);

  const handleClose = () => {
    setUnitModal(false)
  };

  const userUpdate = (id, name, color, color_ex) =>{
      axios.post('etalon/updateunit', {id, name:unitName, color:unitColor, color_ex})
      .then(res => {getUnits(idDep); handleClose()})
      .catch(err => console.log(err))
  }

  const userDelete = (id) => {
      axios.post('etalon/deleteunit', {id})
      .then(res => {getUnits(idDep); handleClose()})
      .catch(err => console.log(err))
  }
  const createMarkup = (text) => {
    return { __html: text };
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
            <h3 className={classes.name}>Редактирование должности</h3>
                <Grid container direction='column' spacing={2} >
                    <Grid item>
                        <TextField
                            className={classes.selectItem}
                            value={unitName}
                            onChange={e => setUnitName(e.target.value)}
                            variant='outlined'
                            label='Название'
                        />
                    </Grid>
                    <Grid item>
                      <FormControl>
                        <InputLabel id="category-label">Выбор категории</InputLabel>
                        <Select
                            labelId="category-label"
                            variant='outlined'
                            className={classes.selectItem}
                            value={unitColor}
                            onChange={e => setUnitColor(e.target.value)}
                        >
                            {Object.keys(colors).map(i => 
                                <MenuItem
                                  key={i}
                                  style={{color:colors[i].color, backgroundColor:'white'}}
                                  value={colors[i].num}
                                >
                                    {colors[i].name}
                                </MenuItem>
                            )}
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl>
                        <InputLabel id="category-label-ex">Выбор категории2</InputLabel>
                        <Select
                            labelId="category-label-ex"
                            variant='outlined'
                            className={classes.selectItem}
                            value={unitColorEx}
                            onChange={e => setUnitColorEx(e.target.value)}
                        >
                            {Object.keys(colors_ex).map(i => 
                                <MenuItem
                                  key={i}
                                  style={{color:colors[i].color, backgroundColor:'white'}}
                                  value={colors_ex[i].num}
                                >
                                    {colors_ex[i].name}
                                </MenuItem>
                            )}
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item className={classes.menuBtn}>
                        <Button onClick={() => userUpdate(id, unitName, unitColor, unitColorEx)}>Сохранить</Button>
                        <Button onClick={() => userDelete(id)}>Удалить</Button>
                    </Grid>
                </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}