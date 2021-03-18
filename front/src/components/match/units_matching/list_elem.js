import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import {
    CompareArrows,
    Done,
} from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ElemToggled from "../sap_list/elem_toggled"
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles((theme) => ({
    needmatch: {
        overflow: 'auto',
        backgroundColor: '#ffe5e6'
    },

    matched: {
        overflow: 'auto',
        backgroundColor: '#ecffed'
    },

    nested: {
        paddingLeft: theme.spacing(2),
        textAlign: 'left',
    },

    selected: {
        color: '#3ada3b',
        backgroundColor: '#97da97'
    },

}));

export default React.memo(function ListElem(props) {
    const classes = useStyles();

    const {item, checked, setChecked, select_structure, value
        //style
    } = props;

    const [itemForm, setItemForm] = React.useState(false);

    const handleCheck = (id) => () => {
        setChecked([id]);
    };

    return <div>
        <ListItem
            className={item.connectedto === null ? classes.needmatch : classes.matched}
            classes={{
                selected: classes.selected
            }}
            key={item.id}
            role="listitem"
            button onClick={() => setItemForm(true)}
            id={item.id}
            //style={style}
        >
            <ListItemText primary={`${item.depname} - ${item.bank}`} />
            <ListItemIcon>
                {item.connectedto === null ? <CompareArrows/> : <Done/>}
            </ListItemIcon>
            <ListItemSecondaryAction //style={{position: style && style.position, top: style && style.top + 40}}
            >
                <Checkbox
                    edge="end"
                    disabled={value === 'mass'}
                    onChange={value === 'mass' ? null : handleCheck(item.id)}
                    checked={value === 'mass' ? true : checked.indexOf(item.id) !== -1}
                    inputProps={{ 'aria-labelledby': `checkbox-list-secondary-label-${item.id}`}}
                />
            </ListItemSecondaryAction>
        </ListItem>
        <Dialog
            open={itemForm}
            onClose={() => setItemForm(false)}
            maxWidth={"md"}
            fullWidth
        >
            <MuiDialogTitle disableTypography style={{margin: 0, padding: 10}}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography variant={"h6"}>
                            {item.depname}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={() => setItemForm(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </MuiDialogTitle>
            <ElemToggled id={item.id} select_structure={select_structure}/>
        </Dialog>
    </div>
})