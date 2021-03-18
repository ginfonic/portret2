import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import axios from 'axios';
import MenuPart from './menuPart';

const useStyles = makeStyles({
  list: {
    width: 380,
    color:'green',
    overflowX:'hidden',
    borderRight:'2px solid green',
    "& a":{
      color:'black'
    },
    "& a:hover":{
      textDecoration:'none'
    }
  },
  fullList: {
    width: 'auto',
  },
  wrap:{
    borderLeft:'5px solid green',
  }
});

export default function SlideMenu() {
  const classes = useStyles();
  const [state, setState] = useState({left: false,});
  const [menuItems, setMenuItems] = useState({tb:[], head:[], gosb:[]});

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
        axios.post('deps', {})
        .then(res => setMenuItems(res.data))
        .catch(e => {})
},[]);

  return (
    <div >
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton onClick={toggleDrawer(anchor, true)}><MenuIcon style={{color:'white'}}/></IconButton>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            <MenuPart
                anchor={anchor}
                toggleDrawer={toggleDrawer}
                classes={classes}
                clsx={clsx}
                menuItems={menuItems}
            />
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
