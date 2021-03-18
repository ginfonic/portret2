import React, { useEffect, useState } from 'react';
import TypePart from './typePart';
import { makeStyles } from '@material-ui/core/styles';
import {
    Backdrop,
    Modal,
    FormControl,
    Fade,
    Select,
    MenuItem,
    InputLabel,
    Grid,
    Accordion
} from '@material-ui/core';
import FileAccordion from './fileAccordion';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        minHeight:'100px',
        minWidth:'600px',
        maxHeight:'80%',
        maxWidth:'80%',
        overflowY:'auto'
    },
    mainCont: {
        marginBottom: '20px',
    }
}));

export default function TransitionsModal(props) {
    const {
        setModalUploads,
    } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [tb, tbSet] = useState([]);
    const [tbSelected, setTbSelected] = useState('-');
    const [types, setTypes] = useState([]);
    const [gosbs, setGosbs] = useState([]);
    const [allFiles, setAllFiles] = useState([]);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setModalUploads(false);
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
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h4 id="transition-modal-title">
                            Документы по филиалам <br/>
                            {tbSelected === '-' &&
                             <span style={{color:'green'}}>
                                 (Выберите филиал для просмотра прикрепленных файлов)
                             </span>
                            }
                        </h4>
                        <Grid container direction='column' className={classes.mainCont}>
                            <Grid item>
                                <FormControl style={{ width: '100%' }}>
                                    <InputLabel id="demo-simple-select-label">Выбор филиала</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={tbSelected}
                                        onChange={e => setTbSelected(e.target.value)}
                                    >
                                        {tb.map((i, index) =>
                                            <MenuItem value={i.id} key={index}>{i.name}</MenuItem>
                                        )}
                                    </Select>

                                </FormControl>
                            </Grid>
                        </Grid>
                        {tbSelected !='-' &&
                            <FileAccordion types={types} getFilesAndtb={getFilesAndtb} allFiles={allFiles} gosbs={gosbs} tbSelected={tbSelected}/>
                        }
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

// {tbSelected !='-' && types.map(i => 
//     <TypePart 
//         key={i.id}
//         typeName={i.type}
//         typeId={i.id}
//         tbSelected={tbSelected}
//         gosbs={gosbs}
//         allFiles={allFiles}
//         getFilesAndtb={getFilesAndtb}
//         />
//     )}