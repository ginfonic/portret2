import React, {useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {Grid, Button} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {StructureContext} from './structureContext';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '300px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [fnBlocs, setFnBlocs] = useState([]);
  const [selected, setSelected] = useState('');
  const {update} = useContext(StructureContext)
  const {
      id,
      lvl,
      depname,
      setModal
  } = props;

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const handleClose = () => {
    setModal(false);
  };

  const heandleChange = () => {
      if(selected !== ''){
          axios.post('structure/changedeps', {id, selected, depname})
          .then(res => {update(); setModal(false)})
      }
  }

  useEffect(() => {
      axios.post('fnblock', {})
      .then(res => setFnBlocs(res.data))
  }, [])

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
            <h4 id="transition-modal-title">Изменить функциональный блок - {depname}</h4>
                <Grid container xs={12} direction="column" >
                    <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Выбрать новый блок</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selected}
                        onChange={handleChange}
                        >
                        {fnBlocs.map((i,index) =>
                            <MenuItem value={i.fnblock} key={index}>{i.fnblock}</MenuItem>
                        )}
                        </Select>
                    </FormControl>
                    </Grid>
                    <Grid item>
                    <Button onClick={heandleChange}>Изменить</Button>
                    </Grid>
                </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
