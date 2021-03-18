import React from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import List from '@material-ui/core/List';
import ItemPart from './itemPart';
import {Link} from 'react-router-dom';


export default function MenuPart(props) {
    const {
        anchor,
        toggleDrawer,
        classes,
        clsx,
        menuItems
    } = props
    return (
            <div 
                className={clsx(classes.list, {
                    [classes.fullList]: anchor === 'top' || anchor === 'bottom',
                })}
                role="presentation"
                onClick={toggleDrawer(anchor, true)}
                onKeyDown={toggleDrawer(anchor, false)}
            >
                <List>
                        <Link to={process.env.REACT_APP_BASE+'/etalon/tb'}>
                        <ListItem button>
                            <ListItemIcon><AccountTreeIcon/></ListItemIcon>
                            <ListItemText primary='Типовая структура Аппарат ТБ' />
                        </ListItem>
                        </Link>

                        <Link to={process.env.REACT_APP_BASE+'/etalon/gosb'}>
                        <ListItem button>
                            <ListItemIcon><AccountTreeIcon/></ListItemIcon>
                            <ListItemText primary='Типовая структура ГОСБ'/>
                        </ListItem>
                        </Link>

                </List>
                <Divider />
                <List>
                    {menuItems.tb.map((i, index) => (
                        <ItemPart
                            name={i.name}
                            key={index}
                            gosbs={menuItems.gosb.filter(gosb => gosb.parent === i.id)}
                            heads={menuItems.head.filter(gosb => gosb.parent === i.id)}
                            classes={classes}
                        />
                    ))}
                </List>
            </div>
    )
}