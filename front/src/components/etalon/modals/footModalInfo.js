import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SetNoteInfo } from '../../../redux/actions';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Grid } from '@material-ui/core';
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
    maxWidth: '600px',
  },
  listStyle: {
      marginTop: '20px'
  },
  textStyle: {
      display: 'flex',
      alignItems: 'center',
      color: 'green'
  }
}));

export default function TransitionsModal(props) {

  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const info = useSelector(state => state.mainReducer.noteInfo);

  const handleClose = () => {
    dispatch(SetNoteInfo(false))
  };

  const createMarkup = (text) => {
    return { __html: text };
  }

  useEffect(() => {
    if(info){
        axios.post('etalon/noteinfo', info)
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    }
  }, [info.name])

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
                <Grid container>
                    <Grid item>
                       Сноски закрепленные за {info.name}
                    </Grid>
                </Grid>
                    {data.length > 0 && data.map(i =>
                        <Grid container key={i.id} className={classes.listStyle}>
                            <Grid item xs={1} className={classes.textStyle}>
                                <span>{i.num}</span>
                            </Grid>
                            <Grid item xs={11}>
                                <span dangerouslySetInnerHTML={createMarkup(i.text)}/>
                            </Grid>
                        </Grid>
                    )}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}