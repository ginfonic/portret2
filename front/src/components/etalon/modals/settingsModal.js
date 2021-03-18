import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, Grid } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import Order from './order';
import FootNotes from '../footNotes';
import Units from '../settingsPart/units';
import Deps from '../settingsPart/deps';
import ChangeOwnModal from './changeOwnModal';
import AddOrderModal from './addOrderModal';
import FlatPart from '../settingsPart/flatPart';
import SubPart from '../settingsPart/subPart';
import DescriptionPart from '../settingsPart/desctiptionPart';
import { setSettingModal } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
      color: 'green'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid green',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: '300px',
    minWidth: '600px',
    height: '80%',
    width: '700px',
    overflow: 'scroll'
  },
  menuBtn: {
    alignSelf: 'flex-end'
  },
}));

export default function SettingsModal(props) {

  const classes = useStyles();
  const {
    getDeps,
    type
  } = props;
  const [open, setOpen] = useState(true);
  const [description, setDescription] = useState({ name: '', text: '', orders:[], lvl: 0, flat: false, subpart:false});
  const [addorderModal, setOrderModal] = useState(false);
  const [own, setOwn] = useState(false);
  const dispatch = useDispatch();
  const depId = useSelector(state => state.mainReducer.settingModal);
  const handleClose = () => {
    getDeps(type)
    dispatch(setSettingModal(false))
  };

  const createMarkup = (text) => {
    return { __html: text };
  }
  const getAllData = (depId) => {
    axios.post('/etalon/getmodify', {id: depId})
    .then(res => setDescription(res.data))
    .catch(err => dispatch(setSettingModal(false)))
  }
  useEffect(() => {
    getAllData(depId)
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
            <h3 className={classes.name}>{description.name}</h3>
            <FootNotes id={depId} type='dep'/>
            {description.lvl > 1 &&
              <Button startIcon={<SwapHorizIcon/>} onClick={() => setOwn(true)}>Переподчинить</Button>
            }
            <FlatPart description={description} setDescription={setDescription} id={depId}/>
            <SubPart description={description} setDescription={setDescription} id={depId}/>
            <Units id={depId}/>
            <Deps id={depId} parentId={description.id}/>
            <Grid container direction='column'>
              <Grid item className={classes.menuBtn}>
                <Button onClick={() => setOrderModal(true)}>Добавить приказ</Button>
              </Grid>
            {description.orders.map(i =>
              <Order key={i.id} data={i} redact={true} getAllData={getAllData} depId={depId}/>
            )}
            <DescriptionPart text={description.text} depId={depId}/>
            </Grid>
          </div>
        </Fade>
      </Modal>
      {addorderModal && <AddOrderModal id={depId} setOrderModal={setOrderModal} getAllData={getAllData}/>}
      {own && <ChangeOwnModal type={type} setOwn={setOwn} depId={depId}/>}
    </div>
  );
}
