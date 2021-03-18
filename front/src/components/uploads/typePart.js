import React, { useState} from 'react';
import {Row, Col, ListGroup} from 'reactstrap';
import { Grid } from '@material-ui/core/Grid';
import {useSelector} from 'react-redux';
import FilesPart from './filesPart';
import Button from '@material-ui/core/Button';
import UploadForm from './uploadForm';
import style from './style.module.css';
import Axios from 'axios';

export default function TypePart(props){

    const {
        typeName,
        tbSelected,
        gosbs,
        typeId,
        allFiles,
        getFilesAndtb
    } = props;


    const [showForm, setShowForm] = useState(false);
    const buttonShow = new Set([3,101])
    const user = useSelector(state => state.mainReducer.user);
    const downloadFile = (id, filename) => {
        Axios.post('upload/down', {id},{responseType:'blob'})
        .then((response) => {
            let table = response.data;
            const data = new Blob([table]);
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        })
    };

    const deleteFile = (id) =>{
        Axios.post('upload/delete', {id})
        .then(res => getFilesAndtb())
    }
    return(
        <>
        <Row>
            <Col className={style.typeHeader}>
                {typeName}
            </Col>
        </Row>
        <Row className={style.typeMiddle}>
            <Col>
                <ListGroup>
                    {allFiles.filter(i => i.type === typeId).map(i =>
                        <FilesPart
                            data={i}
                            key={i.id}
                            downloadFile={downloadFile}
                            deleteFile={deleteFile}
                            typeId={typeId}
                        />
                    )}
                </ListGroup>
            </Col>
        </Row>
        <Row className={style.typeButtons}>
            <Col>
                {tbSelected != '-' &&
                    <Button  color='primary' onClick={() => setShowForm(!showForm)}> {showForm ? 'Закрыть' : 'Добавить файл'}</Button>
                }
            </Col>
        </Row>
        {showForm && <UploadForm gosbs={gosbs} typeId={typeId} tbSelected={tbSelected} getFilesAndtb={getFilesAndtb}/>}
        </>
    )
}