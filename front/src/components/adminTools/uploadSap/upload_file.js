import React, {useState} from 'react';
import {Input} from 'reactstrap';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import {HelpOutline} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 15,
    },
}));

function date_format (string) {
    let split = string.split('-');

    let ok = false;
    for (let num of split) {
        if (isNaN(num)) {
            return false
        }
        ok = true
    }
    return ok
}

export default function Upload(props){
    const classes = useStyles();
    const {setFileId, setBank, setActiveStep, setCompleteStep, completeStep} = props;

    const [message, setMessage] = useState(null);
    const [file, setFile] = useState('');
    const [date, setDate] = useState('');
    const [block, setBlock] = useState(false);

    const submitForm = (e) => {
        if (date.length === 0 ) {
            e.preventDefault();
            setMessage('Введите дату');
        }
        else if (!date_format(date)) {
            e.preventDefault();
            setMessage('Неверный формат даты');
        }
        else {
            e.preventDefault();
            setMessage('Загрузка началась, ожидание обработки....');
            const formData = new FormData();
            formData.append('new_sap', file);
            formData.append('date', date);
            setBlock(true);
            axios.post('admin/preload_init', formData).then(res => {
                setBank(res.data.bank);
                setFileId(res.data.fileId);
                setMessage('');
                setCompleteStep([...completeStep, 0]);
                setActiveStep(1);
            }).catch(function(error) {
                setMessage('Что то пошло не так...');
                console.log('------>>>', error)
            });
        }
    };
    return(
        <Container maxWidth={"sm"} className={classes.root}>
            {message !== null && <span>{message}</span>}
            <div style={{flexGrow: 1, marginTop: 10, marginBottom: 10}}/>
            <TextField
                name='data'
                placeholder='YYYY-mm-dd'
                value={date}
                onChange={e => {setDate(e.target.value); setMessage(false)}}
                variant={"outlined"}
                fullWidth
            >
            </TextField>
            <div style={{flexGrow: 1, marginTop: 10, marginBottom: 10}}/>
            <div>
                <Input
                    onChange={e => {
                        setFile(e.target.files[0]); setMessage(null)
                    }}
                    type='file'
                    accept='.xlsx'
                >
                </Input>
                <Tooltip title={"В ячейке A1 должен быть \"Сотрудник\", в C1 - \"Штатная должность\""}>
                    <HelpOutline/>
                </Tooltip>
            </div>
            <div style={{flexGrow: 1, marginTop: 10, marginBottom: 10}}/>
            <Button variant={"outlined"} onClick={e => submitForm(e)} disabled={block}> Загрузить </Button>
            <div style={{flexGrow: 1, marginTop: 10, marginBottom: 10}}/>
        </Container>
    )
}