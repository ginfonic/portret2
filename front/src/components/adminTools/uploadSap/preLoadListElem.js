import React from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {Error} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";

export default React.memo(function PreLoadListElem(props) {
    const {cutDeps, helpers, obj_index, value, bank, type} = props;

    const [cutDep, setCutDep] = React.useState(cutDeps[type][obj_index]);

    let helper = helpers[type][obj_index].filter(item => item.name === value)[0] || null;

    React.useEffect(() => {
        setCutDep(cutDeps[type][obj_index])
    }, [cutDeps]);

    return <ListItem
        button
        dense
        onClick={() => {
            axios.post('admin/set_cutdeps',
                {cutDep, obj_index, value, bank, type}).then(res => {
                setCutDep(res.data.cutDep)
                });
        }}>
        <ListItemText primary={value}/>
        {(Boolean(helper)) &&
        <Tooltip title={helper.label}>
            <ListItemIcon>
                <Error/>
            </ListItemIcon>
        </Tooltip>
        }
        <Checkbox checked={cutDep.indexOf(value) === -1}/>
    </ListItem>
})