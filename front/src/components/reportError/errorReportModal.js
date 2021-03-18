import React from "react";
import {useSelector, useDispatch} from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import {setErrorReportModal} from '../../redux/actions';
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import {Close} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    greenButton: {
        color: green[500]
    },
    flex: {
        flexGrow: 1,
    },
    closeButton: {
        position: "absolute",
        top: 5,
        right: 5
    },
    title: {
        margin: 0,
        padding: 10,
        position: "relative"
    }
}));

const errorTypes = [
    'Эталонная структура',
    'Структура SAP',
    'Страница метчинга',
    'Административная панель',
    'Таблицы отклонений',
    'Редактор структуры SAP',
    'Загрузка файлов',
    'Вход в систему'
];

export default function () {
    const classes = useStyles();
    const dispatch = useDispatch();
    let errorReportModal = useSelector(state => state.mainReducer.errorReportModal);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [type, setType] = React.useState('');
    const [currentUser, setCurrentUser] = React.useState(true);
    const [name, setName] = React.useState('');
    const [role, setRole] = React.useState('');

    return !errorReportModal ? null :  (
        <Dialog
            open={errorReportModal}
            onClose={() => dispatch(setErrorReportModal(false))}
            maxWidth={"sm"}
            fullWidth
        >
            <MuiDialogTitle disableTypography className={classes.title}>
                <Typography variant={"h6"}>
                    Сообщить об ошибке
                </Typography>
                <IconButton
                    className={classes.closeButton}
                    onClick={() => dispatch(setErrorReportModal(false))}
                >
                    <Close/>
                </IconButton>
            </MuiDialogTitle>
            <DialogContent>
                <FormControl style={{width: '100%'}} variant={"outlined"}>
                    <InputLabel id={"type-error-input"}>
                        Выберите часть приложения, где произошла ошибка
                    </InputLabel>
                    <Select
                        labelId={"type-error-input"}
                        style={{width: '100%'}}
                        value={type}
                        autoWidth
                        variant={"outlined"}
                        onChange={(e) => {
                            setType(e.target.value);
                        }}
                        label={"Выберите часть приложения, где произошла ошибка"}
                    >
                        {errorTypes.map((value, index) =>
                            <MenuItem value={value} key={index}>{value}</MenuItem>
                        )}
                        <MenuItem value={''}>Не определено</MenuItem>
                    </Select>
                </FormControl>
                <p/>
                <TextField
                    fullWidth
                    variant={"outlined"}
                    label={"Название ошибки"}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />
                <p/>
                <TextField
                    fullWidth
                    variant={"outlined"}
                    label={"Описание ошибки"}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                    helperText={"Опишите, какие действия привели к возникновению ошибки"}
                    multiline
                    rows={5}
                    rowsMax={10}
                />
                <p/>
                <Typography>
                    Пользователь с которым произошла ошибка:
                </Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={currentUser}
                            onChange={() => setCurrentUser(!currentUser)}
                            color={"primary"}
                        />
                    }
                    label={"Текущий пользователь"}
                />
                {!currentUser &&<p/>}
                {!currentUser &&
                <TextField
                    fullWidth
                    variant={"outlined"}
                    label={"Имя"}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />}
                {!currentUser &&<p/>}
                {!currentUser &&
                <TextField
                    fullWidth
                    variant={"outlined"}
                    label={"Роль"}
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                    }}
                />}
                {!currentUser &&<p/>}
            </DialogContent>
            <DialogActions>
                <Button variant={"outlined"} onClick={() => dispatch(setErrorReportModal(false))}>
                    Отменить
                </Button>
                <div className={classes.flex}/>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                        dispatch(setErrorReportModal(false));
                        axios.post('error_report/save', {title, description, type, currentUser, name, role})
                    }}
                >
                    Отправить
                </Button>
            </DialogActions>
        </Dialog>
    )
}