import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TypePart from './typePart';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import {
    TextField,
    FormControl,
    FormControlLabel,
    FormGroup,
    makeStyles,
    FormLabel,
    RadioGroup,
    Radio,
    Fade,
    Select,
    MenuItem,
    InputLabel
} from '@material-ui/core';
import Axios from 'axios';
import style from './style.module.css'

export default function UploadModal(props) {

    const {
        setModalUploads,
        className
    } = props;

    const [modal, setModal] = useState(true);
    const [tb, tbSet] = useState([]);
    const [tbSelected, setTbSelected] = useState('-');
    const [types, setTypes] = useState([]);
    const [gosbs, setGosbs] = useState([]);
    const [allFiles, setAllFiles] = useState([]);

    const toggle = () => {
        setModalUploads(false)
    };

    useEffect(() => {
        Axios.post('upload/tbget', {})
        .then(res => {tbSet(res.data.tb); setTypes(res.data.type)});
    }, []);

    const getFilesAndtb = () => {
            Axios.post('upload/gosbget', {id:tbSelected})
            .then(res => {setGosbs(res.data.gosbs); setAllFiles(res.data.files)});
    }
    useEffect(() => {
        if(tbSelected != '-'){
            getFilesAndtb()
        }
    }, [tbSelected]);

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className} size='lg'>
                <ModalHeader>
                     Документы по филиаламъ
                     {types.length === 0 && <span>(Выберите филиал для просмотра файлов)</span>}
                </ModalHeader>
                <ModalBody>
                    <Row className={style.tbSelect}>
                        <Col>
                        <FormControl style={{width:'30%'}}>
                        <InputLabel id="demo-simple-select-label">
                            Выбор филиала 
                        </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={tbSelected}
                                onChange={e => setTbSelected(e.target.value)}
                            >   
                                {tb.map((i,index) =>
                                    <MenuItem value={i.id} key={index}>{i.name}</MenuItem>
                                )}
                            </Select>

                        </FormControl>
                        </Col>
                    </Row>
                    {types.map(i => 
                        <TypePart 
                            key={i.id}
                            typeName={i.type}
                            typeId={i.id}
                            tbSelected={tbSelected}
                            gosbs={gosbs}
                            allFiles={allFiles}
                            getFilesAndtb={getFilesAndtb}
                            />
                    )}
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </Modal>
        </div>
    )
}