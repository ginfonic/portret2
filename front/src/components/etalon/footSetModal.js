import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import FootSetList from './footSetList';
import axios from 'axios';
import { Grid, Divider } from '@material-ui/core';

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
    minHeight:'300px',
    minWidth:'600px',
    height:'600px',
    width:'600px',
    overflowY:'scroll'
  },
  searchInput : {
    width:'80%',
    marginBottom:'20px'
  },
  textHead: {
      color: 'green'
  },
  footPart: {
      marginTop: '20px'
  }
}));

export default function TransitionsModal(props) {
  const {
    setFootModal,
    id,
    type,
    propNotes,
    propSetNotes,
    getNotes
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [searchNotes, setSearchNotes] = useState([]);
  const [addNotes, setAddNotes] = useState([]);

  const getAllNotes = () => {
    axios.post('footnote', {})
    .then(res => {setSearchNotes(res.data);setNotes(res.data) })
    .catch(err => console.log(err))
  }

  const handleClose = () => {
    setFootModal(false);
  };

  const checkNotes = (num) => {
    let arr = propNotes.map(i => i.num);
    let check = arr.indexOf(num);
    if(check === -1){
        return false
    }else{
        return true
    }
 };

 const checkNotesno = (num) => {
    let arr = propNotes.map(i => i.num);
    let check = arr.indexOf(num);
    if(check === -1){
        return true
    }else{
        return false
    }
 };
 
 const changeNote =(type, noteId, depId, exist) => {
     axios.post('etalon/notechanger', {type, noteId, depId, exist})
     .then(res => getNotes(id, type))
     .catch(err => console.log(err))
 }
  useEffect(() => {
    getAllNotes();
  },[])

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
            <h4 id="transition-modal-title">Добавление и удаление сносок</h4>

            <Grid container>
                <Grid item className={classes.textHead}>
                    Назначенные сноски:
                </Grid>
                {notes.filter(i => checkNotes(i.num)).map(i =>
                    <FootSetList
                      key={i.id}
                      type={type}
                      noteId={i.id}
                      text={i.text}
                      num={i.num}
                      checkNotes={checkNotes}
                      propNotes={propNotes}
                      changeNote={changeNote}
                      depId={id}
                    />
                )}
            </Grid>
            <Grid container className={classes.footPart}>
                <Grid item className={classes.textHead}>
                    Выбор сносок:
                </Grid>
                {notes.filter(i => checkNotesno(i.num)).map(i =>
                    <FootSetList
                      key={i.id}
                      type={type}
                      noteId={i.id}
                      text={i.text}
                      num={i.num}
                      checkNotes={checkNotes}
                      propNotes={propNotes}
                      changeNote={changeNote}
                      depId={id}
                    />
                )}
            </Grid>
            
          </div>
        </Fade>
      </Modal>
    </div>
  );
}