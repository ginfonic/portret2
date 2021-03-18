import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {ColorLens, Create} from "@material-ui/icons";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ColorForm from "./colorForm"
import Divider from "@material-ui/core/Divider";


export default React.memo(function ColorItem(props) {
    const {item, setColorList, main} = props;

    const [redact, setRedact] = React.useState(false);
    const [ifRedact, setIfRedact] = React.useState({});

    React.useEffect(() => {
        setIfRedact({color:item.color, unit: item.unit, id: item.id})
    }, [item]);

    return <div>
        {ifRedact.unit ? <ColorForm addColor={redact} setAddColor={setRedact} setColorList={setColorList} if_redact={ifRedact} main={main}/> : null}
        <ListItem
            alignItems={"flex-start"}
        >
            <ListItemIcon>
                <ColorLens style={{color: item.color}} fontSize={"large"}/>
            </ListItemIcon>
            <ListItemText>
                {item.unit}
            </ListItemText>
            <ListItemSecondaryAction>
                <IconButton onClick={() => setRedact(true)}>
                    <Create/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
        <Divider/>
    </div>
})