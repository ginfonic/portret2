import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {Create, ExpandLess, ExpandMore} from "@material-ui/icons";
import Axios from "axios";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    }
}));

export default React.memo(function ErrorItem(props) {
    const classes = useStyles();

    const {item, itemErrors, setItemErrors, unitItem, setUnitErrors, setRedact} = props;

    const [open, setOpen] = React.useState(false);

    const openDescription = () => {
        setOpen(!open)
    };

    const handleCheckboxErrorClick = () => {
        Axios.post('match/error_unit_list_connect', {unitItem, item}).then((response) => {
            setItemErrors(response.data.item_errors);
            setUnitErrors(response.data.unit_errors);
        });
    };

    return <div>
        <ListItem
            dense
            button
            onClick={openDescription}
        >
            <ListItemIcon>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItemIcon>
            <ListItemText>
                {item.name}
            </ListItemText>
            <ListItemSecondaryAction>
                <IconButton onClick={() => {setRedact(item.id)}}>
                    <Create/>
                </IconButton>
                <Checkbox edge={"start"} checked={itemErrors.indexOf(item.id) !== -1} onClick={handleCheckboxErrorClick}/>
            </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <Divider/>
            <List component="div" disablePadding className={classes.nested}>
                <ListItem>
                    <ListItemText>
                        {item.description}
                    </ListItemText>
                </ListItem>
            </List>
            <Divider/>
        </Collapse>
    </div>
})