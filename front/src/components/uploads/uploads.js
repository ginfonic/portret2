import React, {useState} from 'react';
import {Row, Col, Input, Form, FormGroup, Button} from 'reactstrap';
import Server from '../server';
import axios from 'axios';

export default function Uploads(){
    const [file, setFile] = useState('');
    const [date, setDate] = useState('');
    const submitForm = (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('filedata', file);
            formData.append('date', date);
            axios.post('upload/up', formData)
    }
    return(
        <>
        <Row>
            <Col>
            <Form onSubmit={(e) => submitForm(e)}>
            <FormGroup>
                    <Input
                        onChange={(e) => {setFile(e.target.files[0]); }}
                        type='file'
                        >
                    </Input>
                </FormGroup>
                <Button color='link'> Загрузить </Button>
            </Form>
            </Col>
        </Row>
        </>
    )
}