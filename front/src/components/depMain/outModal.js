import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import OutTable from './outTable';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1,1,1),
  },
}));

export default function OutModal(props) {
  const {setoutModal, data} = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setoutModal(false);
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
        <Fade in={open} onExit={() => setOpen(false)}>
          <div className={classes.paper}>
            <h4 id="transition-modal-title">Заштатные сотрудники</h4>
            <OutTable data={data}/>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

