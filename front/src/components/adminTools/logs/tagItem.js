import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {Delete} from "@material-ui/icons";
import Axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";

export default React.memo(function (props) {
    const {item, setTagList} = props;

    const delete_tag = () => {
        Axios.post('admin/logs_tag_delete', {item}).then((response) => {
            setTagList(response.data.tags)
        });
    };

    return <div>
        <ListItem
            dense
        >
            <ListItemIcon>
                {item.id}
            </ListItemIcon>
            <ListItemText>
                {item.tag}
            </ListItemText>
            <ListItemSecondaryAction>
                <IconButton onClick={delete_tag}>
                    <Delete/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    </div>
})