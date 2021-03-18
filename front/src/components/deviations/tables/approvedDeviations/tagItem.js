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
import {Delete, ExpandLess, ExpandMore} from "@material-ui/icons";
import Axios from "axios";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    }
}));

export default React.memo(function (props) {
    const classes = useStyles();

    const {item, id, itemConnectedTags, setItemConnectedTags, tagRow, setTagList} = props;

    const [open, setOpen] = React.useState(false);

    const openDescription = () => {
        setOpen(!open)
    };

    const handleCheckboxErrorClick = () => {
        Axios.post('deviation_approved/tag_connect', {id, item}).then((response) => {
            setItemConnectedTags(response.data.connected);
            tagRow.tags = response.data.tags;
        });
    };

    const delete_tag = () => {
        Axios.post('deviation_approved/tag_delete', {item, id}).then((response) => {
            setItemConnectedTags(response.data.connected);
            tagRow.tags = response.data.row_tags;
            setTagList(response.data.tags)
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
                {item.tag}
            </ListItemText>
            <ListItemSecondaryAction>
                <IconButton onClick={delete_tag}>
                    <Delete/>
                </IconButton>
                <Checkbox edge={"start"} checked={itemConnectedTags.indexOf(item.id) !== -1} onClick={handleCheckboxErrorClick}/>
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