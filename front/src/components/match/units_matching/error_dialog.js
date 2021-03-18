import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import React from "react";
import Axios from "axios";
import List from "@material-ui/core/List";
import {Add} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ErrorItem from "./error_item"
import DialogActions from "@material-ui/core/DialogActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    buttonGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[600],
        marginTop: 12,
        '&:hover': {
            backgroundColor: green[300],
        }
    }
}));

export default React.memo(function ErrorDialog(props) {
    const classes = useStyles();

    const {errorForm, setErrorForm, unitItem, setUnitErrors} = props;

    const [errorList, setErrorList] = React.useState([]);
    const [itemErrors, setItemErrors] = React.useState([]);
    const [addError, setAddError] = React.useState(false);
    const [newErrorName, setNewErrorName] = React.useState('');
    const [newErrorDescription, setNewErrorDescription] = React.useState('');
    const [redact, setRedact] = React.useState(null);
    const [deleteDialog, setDeleteDialog] = React.useState(false);

    React.useEffect(() => {
        Axios.post('match/error_unit_list', {item: unitItem}).then((response) => {
            setErrorList(response.data.error_list);
            setItemErrors(response.data.item_errors);
        });
    }, []);

    React.useEffect(() => {
        if (redact !== null) {
            Axios.post('match/error_unit_to_redact', {redact}).then((res) => {
                setNewErrorName(res.data.name);
                setNewErrorDescription(res.data.description);
            });
        }
    }, [redact]);

    const addNewError = () => {
        setAddError(true)
    };

    const addNewErrorClose = () => {
        setAddError(false);
        setRedact(null);
        setNewErrorDescription('');
        setNewErrorName('');
    };

    const handleErrorFormClose = () => {
        setErrorForm(false)
    };

    const changeNewErrorName = (event) => {
        setNewErrorName(event.target.value)
    };

    const changeNewErrorDescription = (event) => {
        setNewErrorDescription(event.target.value)
    };

    const submitNewError = () => {
        if (newErrorName.length > 0) {
            Axios.post('match/error_unit_list_add',
                {newErrorName, newErrorDescription}).then((response) => {
                    setErrorList(response.data.error_list);
                });
        }
        setAddError(false);
        setNewErrorDescription('');
        setNewErrorName('');
    };

    const redactError = () => {
        if (newErrorName.length > 0) {
            Axios.post('match/error_unit_redact', {redact, newErrorName, newErrorDescription}).then((response) => {
                setErrorList(response.data.error_list);
            });
        }
        setRedact(null);
        setNewErrorDescription('');
        setNewErrorName('');
    };

    const deleteError = () => {
        if (redact !== null) {
            Axios.post('match/error_unit_delete', {redact}).then((response) => {
                setErrorList(response.data.error_list);
            });
        }
        setRedact(null);
        setDeleteDialog(false);
        setNewErrorDescription('');
        setNewErrorName('');
    };

    const error_list = errorList.map((item, index) => <ErrorItem
        item={item}
        itemErrors={itemErrors}
        unitItem={unitItem}
        key={index}
        setItemErrors={setItemErrors}
        setUnitErrors={setUnitErrors}
        setRedact={setRedact}
    />);

    return <div>
        <Dialog open={errorForm} onClose={handleErrorFormClose} maxWidth={"sm"} fullWidth>
            <MuiDialogTitle disableTypography style={{margin: 0, padding: 10}}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography variant={"h6"}>
                            Назначение ошибки
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={handleErrorFormClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </MuiDialogTitle>
            <DialogContent>
                <List>
                    {error_list}
                </List>
            </DialogContent>
            <DialogActions>
                <IconButton onClick={addNewError}>
                    <Add/>
                </IconButton>
            </DialogActions>
        </Dialog>
        {(Boolean(addError) || redact !== null) &&
        <Dialog onClose={addNewErrorClose} open={Boolean(addError) || redact !== null} maxWidth={"sm"} fullWidth>
            <MuiDialogTitle>
                {redact === null ? 'Редактировать ошибку' : `Создать новую ошибку`}
                <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={addNewErrorClose}>
                    <CloseIcon/>
                </IconButton>
            </MuiDialogTitle>
            <DialogContent>
                <TextField variant={"outlined"} label={"Название ошибки"} value={newErrorName} onChange={changeNewErrorName} style={{marginBottom: 10}}/>
                <TextField variant={"outlined"} label={"Описание"} value={newErrorDescription} onChange={changeNewErrorDescription} fullWidth multiline/>
            </DialogContent>
            <DialogActions>
                {redact !== null &&
                <Button onClick={() => setDeleteDialog(true)} variant={"outlined"} color={"secondary"}
                        style={{marginTop: 12, position: "absolute", bottom: 10, left: 10}}>
                    Удалить
                </Button>
                }
                <Button onClick={redact ? redactError : submitNewError} variant={"contained"} className={classes.buttonGreen}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
        }
        {deleteDialog &&
        <Dialog onClose={addNewErrorClose} open={deleteDialog} maxWidth={"xs"} fullWidth>
            <MuiDialogTitle>
                Вы уверены?
                <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={() => setDeleteDialog(false)}>
                    <CloseIcon/>
                </IconButton>
            </MuiDialogTitle>
            <DialogActions>
                <Button onClick={() => setDeleteDialog(false)} variant={"contained"} className={classes.buttonGreen}>
                    Нет
                </Button>
                <Button onClick={deleteError} variant={"outlined"} color={"secondary"} style={{marginTop: 12,}}>
                    Да
                </Button>
            </DialogActions>
        </Dialog>
        }
    </div>
})