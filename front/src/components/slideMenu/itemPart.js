import React, { useState, Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ViewModuleIcon from '@material-ui/icons/ViewModule';


export default function ItemPart(props) {

    const {
        name,
        gosbs,
        heads,
        classes
    } = props;

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Fragment>
            <ListItem button onClick={handleClick}>
                <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
                <ListItemText primary={name} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Divider />
                <Link to={name === 'Московский банк' ? `${process.env.REACT_APP_BASE}/dep/${name.replace(/ /g, '_')}` :
                    `${process.env.REACT_APP_BASE}/dep/${name.replace(/ /g, '_')}`}>
                    <ListItem button style={{ color: 'black' }}>
                        <ListItemIcon><ViewModuleIcon style={{ color: 'green' }} /></ListItemIcon>
                        <ListItemText primary={name} />
                    </ListItem>
                </Link>

                {heads.length > 0 && heads.map((i, index) =>
                    <Link to={`${process.env.REACT_APP_BASE}/dep/${name.replace(/ /g, '_')}/${i.name.replace(/ /g, '_')}`} key={index}>
                        <ListItem style={{ color: 'black' }}>
                            <ListItemIcon><ViewModuleIcon style={{ color: 'green' }} /></ListItemIcon>
                            <ListItemText primary={i.name} />
                        </ListItem>
                    </Link>
                )}
                {gosbs.length > 0 && gosbs.map((i, index) =>
                    <Link to={`${process.env.REACT_APP_BASE}/dep/${name.replace(/ /g, '_')}/${i.name.replace(/ /g, '_')}`} key={index}>
                        <ListItem button style={{ color: 'black' }}>
                            <ListItemIcon><ViewModuleIcon style={{ color: 'green' }} /></ListItemIcon>
                            <ListItemText primary={i.name} />
                        </ListItem>
                    </Link>
                )}
                <Divider />
            </Collapse>

        </Fragment>
    )
}