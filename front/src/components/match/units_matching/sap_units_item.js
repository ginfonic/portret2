import ListItemIcon from "@material-ui/core/ListItemIcon";
import Tooltip from "@material-ui/core/Tooltip";
import {ExpandLess, Settings} from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import ListItem from "@material-ui/core/ListItem";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import UnitItemCollapse from './unit_item_collapse'

export default React.memo(function UnitItem(props) {
    const {item, selected, setSelected, select_structure} = props;

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(!open)
    };

    const select_sap = (item) => () => {
        let new_selected = [...selected];

        if (selected.filter(select => select.name === item.name).length === 0)
        {
            new_selected.push(item);
        }
        else {
            new_selected = selected.filter(select => select.name !== item.name);
        }
        setSelected(new_selected);
    };

    return <div>
        <ListItem
            key={item.id}
            role="listitem"
            selected={open}
        >
            <ListItemIcon>
                <Tooltip title={"Добавить ошибку/флаг"} arrow>
                    <IconButton onClick={handleOpen} size={"small"}>
                        {open ? <ExpandLess/> : <Settings/>}
                    </IconButton>
                </Tooltip>
            </ListItemIcon>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction
            >
                <Checkbox
                    edge="end"
                    checked={selected.filter(select => select.name === item.name).length !== 0}
                    onClick={select_sap(item)}
                />
            </ListItemSecondaryAction>
        </ListItem>
        {open && <UnitItemCollapse open={open} item={item} select_structure={select_structure}/>}

    </div>
})