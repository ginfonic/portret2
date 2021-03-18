import React, { useState } from 'react';
import { Row, Col,Input } from 'reactstrap';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Button
} from '@material-ui/core';
import Axios from 'axios';
import style from './style.module.css'

export default function UploadForm(props) {
    const {
        gosbs,
        typeId,
        tbSelected,
        getFilesAndtb
    } = props;

    const [gosb, setGosb] = useState('-');
    const [fio, setFio] = useState('');
    const [koname, setKoname] = useState('-');
    const [comment, setComment] = useState('');
    const [dateBegin, setDateBegin] = useState(new Date());
    const [dateDone, setDateDone] = useState(new Date());
    const [file, setFile] = useState('');

    const gosbShow = new Set(['43efd630-2b88-431e-8ef9-a011608a68d1', '8c80da06-285f-4f69-abaa-c424ad25dd0d']);
    const koNameShow = new Set(['43efd630-2b88-431e-8ef9-a011608a68d1']);
    const fioShow = new Set(['f803d29d-505c-48c7-9965-0110e752abdb', '8c80da06-285f-4f69-abaa-c424ad25dd0d']);
    const dateShow = new Set(['6f132391-a3e9-4345-b65b-989205cb12a9']);
    const commentShow = new Set(['6f132391-a3e9-4345-b65b-989205cb12a9']);

    const sendFiles = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('filedata', file);
        formData.append('gosb', gosb);
        formData.append('fio', fio);
        formData.append('koname', koname);
        formData.append('dateBegin', dateBegin);
        formData.append('dateDone', dateDone);
        formData.append('typeId', typeId);
        formData.append('tbSelected', tbSelected);
        formData.append('comment', comment);
        Axios.post('upload/up', formData)
        .then(res => getFilesAndtb())
    }
    return (
        <>
            <Row>
                <Col className={style.formHeader}>
                    Заполните форму добавления файла
            </Col>
            </Row>
                <form>
            <Row >
                <Col>
                {gosbShow.has(typeId) &&
                    <Row className={style.formWrapper}>
                        <Col>
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel id="demo-simple-select-label">Выбор ГОСБ</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={gosb}
                                    onChange={e => setGosb(e.target.value)}
                                >
                                    <MenuItem value={'-'}>-</MenuItem>
                                    {gosbs.map((i, index) =>
                                        <MenuItem value={i.name} key={index}>{i.name}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Col>
                    </Row>
                }
                {fioShow.has(typeId) &&

                    <Row className={style.formWrapper}>
                        <Col>
                            <FormControl style={{ width: '100%' }}>
                                <TextField id='standart' label="ФИО руководителя" value={fio} onChange={e => setFio(e.target.value)} />
                            </FormControl>
                        </Col>
                    </Row>
                }
                    {koNameShow.has(typeId) &&
                    <Row className={style.formWrapper}>
                        <Col>
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel id="demo-simple-select-labelr">Название КО</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-selectt"
                                    value={koname}
                                    onChange={e => setKoname(e.target.value)}
                                >
                                    <MenuItem value={'-'}>-</MenuItem>
                                    <MenuItem value={'Правление'}>Правление</MenuItem>
                                    <MenuItem value={'Совет'}>Совет</MenuItem>
                                </Select>
                            </FormControl>
                        </Col>
                    </Row>
                    }
                {dateShow.has(typeId) && <>
                    <Row className={style.formWrapper}>
                        <Col>
                            <FormControl style={{ width: '100%' }}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker value={dateBegin} label={'Дата начала действия приказа'}
                                        placeholder={"день/месяц/год"}
                                        clearable
                                        onChange={new_date => setDateBegin(new_date.toString())}
                                        format={'dd/MM/yyyy'}
                                    />
                                </MuiPickersUtilsProvider>

                            </FormControl>
                        </Col>
                    </Row>
                    <Row className={style.formWrapper}>
                        <Col>
                            <FormControl style={{ width: '100%' }}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker value={dateDone} label={'Дата окончания действия приказа'}
                                        placeholder={"день/месяц/год"}
                                        clearable
                                        onChange={new_date => setDateDone(new_date.toString())}
                                        format={'dd/MM/yyyy'}
                                    />
                                </MuiPickersUtilsProvider>

                            </FormControl>
                        </Col>
                    </Row> </>
                    }
                    {commentShow.has(typeId) &&
                    <Row className={style.formWrapper}>
                        <Col>
                            <FormControl style={{ width: '100%' }}>
                                <TextField id='standart' label="Комментарий" value={comment} onChange={e => setComment(e.target.value)} />
                            </FormControl>
                        </Col>
                    </Row>
                    }
                    <Row className={style.formWrapper}>
                        <Col>
                            <FormControl style={{ width: '100%' }}>
                                <Input
                                    onChange={(e) => { setFile(e.target.files[0]); }}
                                    type='file'
                                    accept='.pdf, .docx, .zip, .rar'
                                >
                                </Input>
                            </FormControl>
                        </Col>
                    </Row>
                   <Row>
                       <Col>
                        {file != '' &&
                            <Button variant='outlined' type='submit' onClick={e=> sendFiles(e)}>Отправить</Button>
                        }
                       </Col>
                   </Row>
                </Col>
            </Row>
            </form>
        </>
    )
}