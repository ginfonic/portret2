import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import ListItemText from "@material-ui/core/ListItemText";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ApprovedItem from './approvedItem';
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export default React.memo(function (props) {
    const classes = useStyles();

    const {approved} = props;

    const [openSameDep, setOpenSameDep] = React.useState(false);

    return <div>
        <ListItem
            divider
            button
            onClick={() => {
                setOpenSameDep(!openSameDep)
            }}
        >
            <ListItemText>
                Согласованные отклонения
            </ListItemText>
            <ListItemIcon>
                {openSameDep ? <ExpandLess/> : <ExpandMore/>}
            </ListItemIcon>
        </ListItem>

        <Collapse in={openSameDep} timeout={"auto"} unmountOnExit className={classes.nested}>
            <List>
                {approved.map((row, index) => <ApprovedItem row={row} key={index}/>)}
            </List>
        </Collapse>
    </div>
})