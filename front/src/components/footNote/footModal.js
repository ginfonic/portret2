import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FootList from './footList';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import FootAddModal from './footAddModal';
import AddIcon from '@material-ui/icons/Add';

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
    minHeight:'300px',
    minWidth:'600px',
    height:'600px',
    width:'600px',
    overflow:'scroll'
  },
  searchInput : {
    width:'80%',
    marginBottom:'20px'
  }
}));

export default function TransitionsModal(props) {
  const {
      setFootModal,
      noteArr,
      setFootNote,
      type
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [addModal,setFootAddModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [searchNotes, setSearchNotes] = useState([]);
  const handleClose = () => {
    setFootModal(false);
  };

  const handleSearch = (event) => {
    setSearchNotes(
        notes.filter(el =>{
          return el.text.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
       })
    )  
   };

  const getAllNotes = () => {
    axios.post('footnote', {})
    .then(res => {setSearchNotes(res.data);setNotes(res.data) })
    .catch(err => console.log(err))
  };

  useEffect(() => {
    getAllNotes()
  },[]);
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
            <h2 id="transition-modal-title">Сноски</h2>
            <Grid>
              <TextField label='Поиск сносок' className={classes.searchInput} onChange={(e) => handleSearch(e)}/>
            </Grid>
            <Grid item>
              <Button onClick={() => setFootAddModal(true)} startIcon={<AddIcon/>}>Добавить сноску</Button>
            </Grid>
            {searchNotes.map(i =>
                <FootList
                    key={i.id}
                    id={i.id}
                    text={i.text}
                    num={i.num}
                    getAllNotes={getAllNotes}
                    type={type}
                    noteArr={noteArr}
                    setFootNote={setFootNote}
                />
            )}
          </div>
        </Fade>
      </Modal>
      {addModal && <FootAddModal setFootAddModal={setFootAddModal} getAllNotes={getAllNotes}/>}
    </div>
  );
}
