import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import {Link} from "@material-ui/icons";
import React from "react";
import Typography from "@material-ui/core/Typography";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Grid from "@material-ui/core/Grid";
import ElemToggled from "../sap_list/elem_toggled";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import ListItemIcon from "@material-ui/core/ListItemIcon";

export default React.memo(function UnitItemCollapse(props) {
    const {dep, select_structure} = props;

    const [itemForm, setItemForm] = React.useState(false);

    return <div>
        <ListItem
            button
            onClick={() => {
                setItemForm(true)
            }}
        >
            <ListItemIcon>
                <Link/>
            </ListItemIcon>
            <ListItemText primary={`${dep.depname} - ${dep.bank}`}/>
        </ListItem>
        {itemForm &&
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
                                {dep.depname}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={() => setItemForm(false)}>
                                <CloseIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </MuiDialogTitle>
                <ElemToggled id={dep.id} select_structure={select_structure}/>
            </Dialog>
        }
    </div>
});