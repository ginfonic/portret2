import ListItemIcon from "@material-ui/core/ListItemIcon";
import Tooltip from "@material-ui/core/Tooltip";
import {AccountBox, AccountCircle} from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import ListItem from "@material-ui/core/ListItem";
import React from "react";

export default React.memo(function UnitItem(props) {
    const {item, selected, setSelected} = props;

    const select_etalon = (id) => () => {
        if (selected.indexOf(id) === -1) {
            setSelected([id])
        }
        else {
            setSelected([])
        }
    };

    return <div>
        <ListItem
            key={item.id}
            role="listitem"
        >
            <ListItemIcon>
                <Tooltip title={item.unit} arrow>
                    <AccountBox style={{color: item.color}}/>
                </Tooltip>
                <Tooltip title={item.unit_ex} arrow>
                    <AccountCircle style={{color: item.color_ex}}/>
                </Tooltip>
            </ListItemIcon>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction
            >
                <Checkbox
                    edge="end"
                    checked={selected.indexOf(item.id) !== -1}
                    onClick={select_etalon(item.id)}
                />
            </ListItemSecondaryAction>
        </ListItem>
    </div>
})