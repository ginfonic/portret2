import React from "react";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {green} from "@material-ui/core/colors";
import { SliderPicker } from "react-color"
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import AcceptColorDelete from "./acceptColorDelete";
import {useDispatch} from "react-redux";
import Axios from "axios";


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

export default React.memo(function ColorForm(props) {
    const classes = useStyles();
    const {addColor, setAddColor, setColorList, if_redact, main} = props;

    const [newColorUnit, setNewColorUnit] = React.useState(if_redact ? if_redact.unit : '');
    const [color, setColor] = React.useState(if_redact ? {hex: if_redact.color} : {hex: "#40bfad"});
    const [colorDelete, setColorDelete] = React.useState(false);

    const dispatch = useDispatch();

    const changeNewColorName = (event) => {
        setNewColorUnit(event.target.value)
    };

    const closeNewColorForm = () => {
        setAddColor(false)
    };

    const submitNewColor = () => {
        if (newColorUnit.length > 0) {
            Axios.post(`colors/${if_redact ? 'redactcolor' : 'addcolor'}`, {newColorUnit, color: color.hex, if_redact, main})
            .then((response) => {
                setColorList(response.data);
            });
        }
        setAddColor(false)
    };

    return <Dialog onClose={closeNewColorForm} open={addColor} maxWidth={"sm"} fullWidth>
        <MuiDialogTitle> {if_redact ? 'Редкатировать категорию' : 'Создать новую категорию'} </MuiDialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField variant={"outlined"} label={"Напишите специализацию должности"} value={newColorUnit} onChange={changeNewColorName} style={{marginBottom: 15}} fullWidth multiline/>
                </Grid>
                <Grid item xs={6}>
                    <div className={classes.text}>
                        Выберите цветвв:
                        <Chip style={{backgroundColor: color.hex, marginLeft: 25}} label={"Текущий цвет"}/>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <SliderPicker color={color} onChange={setColor}/>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            {if_redact ? <div style={{position: "absolute", bottom: 6, left: 6}}>
                    <Button color={"secondary"} variant={"outlined"} onClick={() => setColorDelete(true)}>
                        Удалить
                    </Button>
                <AcceptColorDelete colorDelete={colorDelete} setColorDelete={setColorDelete} id={if_redact.id} setColorList={setColorList} closeNewColorForm={closeNewColorForm} main={main}/>
                </div>
                : null}
            <Button onClick={submitNewColor} variant={"contained"} className={classes.buttonGreen}>
                Сохранить
            </Button>
        </DialogActions>
    </Dialog>
})