import React, {useState} from 'react';
import {Grid, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

export default function DescriptionPart(props){
    const {
        depId,
        text
    } = props;

    const [depText, setDepText] = useState('');

    const updateDescription = () => {
        axios.post('etalon/updatedescription', {id: depId, text: depText})
        .then(res => {})
        .catch(err => console.log(err))
    }
    return(
        <Grid container direction='column'>
            <Grid item>
               Редактировать описание
            </Grid>
            <Grid item>
                <CKEditor
                    style={{minHeight:'200px'}}
                    editor={ClassicEditor}
                    data={text}
                    onChange={(event, editor) => setDepText(editor.getData())}
                />
            </Grid>
            <Grid item>
                <Button onClick={updateDescription}>
                    Обновить описание
                </Button>
            </Grid>
        </Grid>
    )
}