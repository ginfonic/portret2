import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(12),
    },

    nestedSelected: {
        paddingLeft: theme.spacing(12),
        backgroundColor: '#ecffed',
    },

    selected: {
        backgroundColor: '#ecffed',
    }
}));

export default React.memo(function (props) {
    const classes = useStyles();

    const {selected, setSelected, tb} = props;

    const [open, setOpen] = React.useState(false);

    const check = (id) => {
        let new_selected = {...selected};
        new_selected.deps = [];

        let index = new_selected.banks.indexOf(id);
        if (index === -1) {
            new_selected.banks.push(id);
        }
        else {
            new_selected.banks.splice(index, 1);
        }
        setSelected(new_selected);
    };

    return (
        <div>
            <ListItem
                button
                onClick={() => setOpen(!open)}
                className={selected.banks.indexOf(tb.id) !== -1 && classes.selected}
            >
                <ListItemIcon>
                    {tb.childs.length > 0 ? open ? <ExpandLess/> : <ExpandMore/> : null}
                </ListItemIcon>
                <ListItemText primary={tb.name}/>
                <ListItemSecondaryAction>
                    <Checkbox onChange={() => check(tb.id)} checked={selected.banks.indexOf(tb.id) !== -1}/>
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={open} timeout={"auto"} unmountOnExit>
                <List component={"div"} disablePadding>
                    {tb.childs.map(gosb =>
                        <ListItem
                            className={selected.banks.indexOf(gosb.id) !== -1 ? classes.nestedSelected : classes.nested}
                            key={gosb.name}
                            button
                        >
                            <ListItemText primary={gosb.name}/>
                            <ListItemSecondaryAction>
                                <Checkbox
                                    onChange={() => check(gosb.id)}
                                    checked={selected.banks.indexOf(gosb.id) !== -1}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>)}
                </List>
            </Collapse>
        </div>
    )
})