import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import {Grid, Button} from '@material-ui/core/';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilesPart from './filesPart';
import UploadIcon from '@material-ui/icons/CloudUpload';
import AddFileModal from './addFileModal';
import Axios from 'axios';
import {useSelector} from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color:'green',
    fontWeight: 'bold'
  },
}));

export default function SimpleAccordion(props) {
  const {
      types,
      getFilesAndtb,
      allFiles,
      gosbs,
      tbSelected
    } = props;
  const classes = useStyles();

  const [addFileModal, setAddFileModal] = useState(false);
  const buttonShow = new Set([17,14,1,2,3,4,5,6,7,8]);
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
    .catch(err => console.log(err))
};

const deleteFile = (id) =>{
    Axios.post('upload/delete', {id})
    .then(res => getFilesAndtb())
}

  return (
    <div className={classes.root}>
     {types.map((i,index) => 
        <Accordion key={index}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
            <Typography className={classes.heading}>{i.type}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container direction='column'>
                    <Grid item>
                        {allFiles.filter(j => j.type === i.id).map((j,index) =>
                            <FilesPart
                            data={j}
                            key={j.id}
                            downloadFile={downloadFile}
                            deleteFile={deleteFile}
                            typeId={i.id}
                        />
                        )}
                    </Grid>
                    <Grid item>
                    {buttonShow.has(user.role.id) &&
                        <Button
                         startIcon={<UploadIcon/>}
                         color='primary'
                         variant='outlined'
                         onClick={() => setAddFileModal(i.id)}
                         >
                            Добавить файл
                        </Button>
                    }
                    </Grid>
                </Grid>
            </AccordionDetails>
            {addFileModal === i.id && 
                <AddFileModal
                    setAddFileModal={setAddFileModal}
                    typeId={i.id}
                    gosbs={gosbs}
                    getFilesAndtb={getFilesAndtb}
                    tbSelected={tbSelected}
            />}
        </Accordion>
     )}
    </div>
  );
}
