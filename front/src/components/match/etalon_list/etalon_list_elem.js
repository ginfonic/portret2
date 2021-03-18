import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import Tooltip from "@material-ui/core/Tooltip";
import {CheckCircle, CheckCircleOutline, ExpandLess, ExpandMore} from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Axios from "axios";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    selected: {
        '&:button': {
            backgroundColor: green[500],
        },
        '&:selected': {
            backgroundColor: green[500],
        }
    },

    nested: {
        paddingLeft: theme.spacing(4),
    }

}));

const is_object = (obj) => {
    return (typeof obj === "object" && obj !== null && !obj.id)
};


const RenderObject = React.memo(function (props) {
    const classes = useStyles();

    const {obj, add, setAdd, setProgress, setChosen, chosen, select_structure} = props;

    const item = obj.elem;

    const [open, setOpen] = React.useState(item.lvl === 1);

    const handleClick = () => {
        setOpen(!open)
    };

    const handleListItemClick = () => {
        Axios.post('match/etalon_item',
            {select_structure, id: item.id}).then((response) => {
            setChosen(response.data.item);
        });
    };

    return <div>
        <ListItem
            button
            role="listitem"
            selected={chosen !== null ? item.id === chosen.id : false}
            onClick={handleListItemClick}
        >
            <ListItemIcon>
                {item.connections >= 1 ?
                    <Tooltip
                        title={`Connections: ${item.connections}`}
                        arrow>
                        <CheckCircle color={chosen !== null ? chosen.id === item.id ? "inherit" : "action" : "action"}/>
                    </Tooltip> :
                    <Tooltip title={`Connections: ${item.connections}`} arrow>
                        <CheckCircleOutline color={chosen !== null ? chosen.id === item.id ? "inherit" : "action" : "action"}/>
                    </Tooltip>}
            </ListItemIcon>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction>
                <IconButton onClick={handleClick}>
                    {open ? <ExpandLess/> : <ExpandMore/>}
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <Divider/>
            <List component="div" disablePadding className={classes.nested}>
                <RenderArray
                    array={obj.array}
                    add={add}
                    setAdd={setAdd}
                    setChosen={setChosen}
                    chosen={chosen}
                    setProgress={setProgress}
                    select_structure={select_structure}/>
            </List>
            <Divider/>
        </Collapse>

    </div>
});


const RenderArray = React.memo(function (props) {
    const {array, add, setAdd, setChosen, chosen, setProgress, select_structure} = props;

    return <List component="nav" aria-label="main mailbox folders">
        {array.map((elem) => is_object(elem) ?
            <RenderObject
                key={`obj-${elem.elem.id}`}
                obj={elem}
                add={add}
                setAdd={setAdd}
                setChosen={setChosen}
                chosen={chosen}
                setProgress={setProgress}
                select_structure={select_structure}/> :
            <EtalonListElem
                key={elem.id}
                item={elem}
                add={add}
                setAdd={setAdd}
                setChosen={setChosen}
                chosen={chosen}
                setProgress={setProgress}
                select_structure={select_structure}/>)}
    </List>
});


const EtalonListElem = React.memo(function EtalonListElem(props) {
    const {item, setChosen, chosen, select_structure} = props;

    const handleListItemClick = () => {
        Axios.post('match/etalon_item',
            {select_structure, id: item.id}).then((response) => {
            setChosen(response.data.item);
        });
    };

    return <ListItem
        button
        role="listitem"
        selected={chosen !== null ? item.id === chosen.id : false}
        onClick={handleListItemClick}
    >
        <ListItemIcon>
            {item.connections >= 1 ?
                <Tooltip
                    title={`Connections: ${item.connections}`}
                    arrow>
                    <CheckCircle color={chosen !== null ? chosen.id === item.id ? "inherit" : "action" : "action"}/>
                </Tooltip> :
                <Tooltip title={`Connections: ${item.connections}`} arrow>
                    <CheckCircleOutline color={chosen !== null ? chosen.id === item.id ? "inherit" : "action" : "action"}/>
                </Tooltip>}
        </ListItemIcon>
        <ListItemText primary={item.name} />
    </ListItem>
});

export default RenderArray