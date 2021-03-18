import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FootList from './footList';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddIcon from '@material-ui/icons/Add';
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
    minHeight:'200px'
  },
  searchInput : {
    width:'80%',
    marginBottom:'20px'
  },
  menuBtn: {
    alignSelf: 'flex-end'
},
}));

export default function TransitionsModal(props) {
  const {
    setFootAddModal,
    getAllNotes
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [num, setNum] = useState('');
  const [text, setText] = useState('');

  const handleClose = () => {
    setFootAddModal(false);
  };

  const addNote = (num, text) =>{
      axios.post('footnote/add', {num, text})
      .then(res => { setNum(''); setText(''); getAllNotes()})
      .catch(err => handleClose)
      
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
            <h4 id="transition-modal-title">Добавить сноску</h4>
            <Grid container direction='column' spacing={3}>
                <Grid item>
                    <TextField label='Номер' onChange={e=>setNum(e.target.value)} value={num}/>
                </Grid>
                
                <Grid item>
                    <CKEditor
                        style={{minHeight:'200px'}}
                        editor={ClassicEditor}
                        data={text}
                        onChange={(event, editor) => setText(editor.getData())}
                    />
                </Grid>
                <Grid item className={classes.menuBtn}>
                    {(num.length > 0 && text.length > 0) &&
                        <Button onClick={() => addNote(num,text)}>Добавить</Button>
                    }
                    <Button onClick={handleClose}>Закрыть</Button>
                </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
