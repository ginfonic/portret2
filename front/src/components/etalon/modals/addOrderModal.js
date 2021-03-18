import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
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
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight:'400px',
    minWidth:'400px'
  },
  searchInput : {
    width:'80%',
    marginBottom:'20px'
  },
  menuBtn: {
    alignSelf: 'flex-end'
  },
}));

export default function AddOrderModal(props) {
  const {
    setOrderModal,
    id,
    getAllData,
  } = props;
  const classes = useStyles();
  const [num, setNum] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOrderModal(false);
  };
 
  const addOrder = (num, date, name, text, id) => {
      axios.post('orders/add', {num, date, name, text, id})
      .then(res => {getAllData(id); handleClose()})
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
            <h4 id="transition-modal-title">Добавить приказ</h4>
            <Grid container direction='column' spacing={3}>
                <Grid item>
                    <TextField value={num} onChange={e=>setNum(e.target.value)} label='Номер'/>
                </Grid>
                <Grid item>
                    <TextField value={date} onChange={e=>setDate(e.target.value)} label='Дата'/>
                </Grid>
                <Grid item>
                    <TextField value={name} onChange={e=>setName(e.target.value)} style={{width:'100%'}} multiline rows={4} variant='outlined' label='Название'/>
                </Grid>
                <Grid item>
                    <TextField value={text} onChange={e=>setText(e.target.value)}  style={{width:'100%'}} multiline rows={4} variant='outlined' label='Описание'/>
                </Grid>
                <Grid item className={classes.menuBtn}>
                    <Button onClick={() => addOrder(num, date, name, text, id)}>Добавить</Button>
                    <Button onClick={handleClose}>Закрыть</Button>
                </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}