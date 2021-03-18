import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import OwnAutocomplite from './ownAutocomplite';
import { Grid } from '@material-ui/core';
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
    minWidth: '400px',
  },
}));

export default function TransitionsModal(props) {

  const classes = useStyles();

  const {
    setOwn,
    depId,
    type
  } = props;

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOwn(false)
  };


 

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
            <OwnAutocomplite depId={depId} type={type} handleClose={handleClose}/>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
