import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {useDispatch, useSelector} from 'react-redux';
import { setEtalonModal } from '../../../redux/actions';
import HomeIcon from '@material-ui/icons/Business';
import { history } from '../../../index';
import axios from 'axios';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    position: 'relative'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginBottom:'40px'
  },
  closeBtn: {
    cursor: 'pointer',
    position: 'absolute',
    top:'-5px',
    right: '5px',
    fontSize:'1.3em',
    color: 'red'
  }
}));

export default function EtalonModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [depIfo, setDepInfo] = useState({name:'', type:''});
  const dispatch = useDispatch();
  const id = useSelector(state => state.mainReducer.etalonModal);

  const handleClose = () => {
    dispatch(setEtalonModal(false))
  };

  const heandleButton =()=>{
      history.push(`${process.env.REACT_APP_BASE}/etalon/${depIfo.type}`)
  };
  useEffect(() => {
    axios.post('etalon/getdep',{id:id})
    .then(res => setDepInfo({name: res.data.name, type:res.data.type}))
    .catch(err => console.log(err))
  }, [id]);

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
        <Fade in={open} onExit={() => setOpen(false)}>
          <div className={classes.paper}>
            <h4 style={{color:'gray'}} id="transition-modal-title">Типовая структура</h4>
                <Grid className={classes.title} onClick={heandleButton}>
                  <HomeIcon style={{color:'gray'}}/><span style={{color:'green'}}>{depIfo.name}</span>
                </Grid>
            <span className={classes.closeBtn} onClick={handleClose}>
              &times;
            </span>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
