import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { setEtalonObj } from '../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import GosbPart from './gosbPart';
import TbPart from './tbPart';
import axios from 'axios';
import { ListItem } from '@material-ui/core';

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
    height: '80%',
    overflowY:'auto'
  },
}));

export default function TransitionsModal(props) {
  const classes = useStyles();

  const {
      countModal,
      setCountModal,
      type
  } = props;

  const [open, setOpen] = useState(true);
  const[data, setData] = useState([]);
  const dipspatch = useDispatch();
  const etalonCount = useSelector(state => state.mainReducer.etalonCount);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setCountModal(false);
  };

  const precountUpdate =()=>{
      axios.post('precount')
  }

  useEffect(()=>{
    axios.post('deps/getall', {type})
    .then(res => setData(res.data))
  },[])

  useEffect(() => {
    if(etalonCount.deps.length > 0){
        axios.post('precount/deps', { deps:etalonCount.deps, type:type})
        .then(res => dipspatch(setEtalonObj(res.data)))
    }
  },[etalonCount.deps.length]);

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
          <Grid container xs={3} className={classes.paper}>
                <Grid container direction='rows'>
                  <Grid item>
                    <Button onClick={precountUpdate}>
                        Пересчитать
                    </Button>
                    <Button >
                        Выделить все
                    </Button>
                    <Button >
                        Отменить выбор
                    </Button>
                  </Grid>
              
                </Grid>
                {type === 'gosb' &&
                  <Grid container>
                    <List>
                      {data.map((i,index) =>
                        <TbPart data={i} key={index}/>
                      )}
                    </List>
                  </Grid>
                }
                {type === 'tb' &&
                  <Grid container>
                    <GosbPart data={data}/>
                  </Grid>
                }
          </Grid>
        </Fade>
      </Modal>
    </div>
  );
}