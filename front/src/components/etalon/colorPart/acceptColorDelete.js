import React from "react";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Axios from "axios";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {green} from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogContentText from "@material-ui/core/DialogContentText";

const useStyles = makeStyles((theme) => ({
    text: {
        ...theme.typography.body1,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },

    buttonGreen: {
        color: theme.palette.common.white,
        marginTop: 30,
        backgroundColor: green[600],
        '&:hover': {
            backgroundColor: green[300],
        }
    }
}));

export default React.memo(function AcceptColorDelete(props) {
    const classes = useStyles();
    const {colorDelete, setColorDelete, id, setColorList, closeNewColorForm, main} = props;

    const submitDelete = () => {
        Axios.post('colors/deletecolor', {id, main}, {
        }).then((response) => {
            setColorList(response.data);
        });
        setColorDelete(false);
        closeNewColorForm()
    };

    const exitDelete = () => {
        setColorDelete(false)
    };

    return <Dialog onClose={exitDelete} open={colorDelete} maxWidth={"xs"} fullWidth>
        <MuiDialogTitle disableTypography style={{margin: 0, padding: 10}}>
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant={"h6"}>
                        Вы уверены?
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={exitDelete}>
                        <CloseIcon/>
                    </IconButton>
                </Grid>
            </Grid>
        </MuiDialogTitle>
        <DialogContent>
            <DialogContentText>
                Удаление категории может привести к необратимым последствиям и сломать некоторые другие функции сайта.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={exitDelete} variant={"contained"} className={classes.buttonGreen}>
                Нет
            </Button>
            <Button onClick={submitDelete} variant={"outlined"} color={"secondary"} style={{marginTop: 30}}>
                Да
            </Button>
        </DialogActions>
    </Dialog>
})