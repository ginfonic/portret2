import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Grid } from '@material-ui/core';
import Order from './order';
import { setDescriptionModal } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid green',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: '300px',
    minWidth: '600px',
    height: '80%',
    width: '900px',
    overflow: 'scroll'
  },
}));

export default function TransitionsModal(props) {

  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [description, setDescription] = useState({ name: '', text: '', orders:[] });
  const dispatch = useDispatch();
  const info = useSelector(state => state.mainReducer.descriptionModal)
  const handleClose = () => {
    dispatch(setDescriptionModal(false))
  };

  const createMarkup = (text) => {
    return { __html: text };
  }

  useEffect(() => {
    axios.post('etalon/getinfo', { id: info })
      .then(res => setDescription(res.data))
      .catch(err => dispatch(setDescriptionModal(false)))
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
            <h2 id="transition-modal-title">{description.name}</h2>
              {description.orders.length > 0 && <Grid item>Приказы</Grid>}
            {description.orders.map(i =>
              <Order key={i.id} data={i}/>
              )}
            <Grid container>
              <div item dangerouslySetInnerHTML={createMarkup(description.text)}/>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
