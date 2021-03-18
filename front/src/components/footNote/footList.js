import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import UpdateModal from './updateModal';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        minHeight: '600px',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    part: {
        borderBottom: '1px solid green',
        marginBottom: '10px',
        padding: '5px'
    },
    menuBtn: {
        alignSelf: 'flex-end'
    },
    text: {
        marginTop: '15px',
        fontFamily:'Times New Roman, Times, sans-serif'
    }

}));

export default function FootList(props) {
    const {
        id,
        text,
        num,
        getAllNotes,
        type,
        noteArr,
        setFootNote
    } = props;

    const [footUpdateModal, setFootUpdateModal] = useState(false);
    const createMarkup = (text) => {
        return { __html: text };
    };

    const noteDel = (id) => {
        axios.post('footnote/del', {id})
        .then(res => getAllNotes())
        .catch(err => console.log(err))
    };

    const classes = useStyles();
    return (
        <>
        <Grid container direction='column' className={classes.part}>
            <Grid item>
                <Chip label={num} color='primary' size='small' />
            </Grid>
            <div className={classes.text} dangerouslySetInnerHTML={createMarkup(text)} />
            <Grid item className={classes.menuBtn}>
                <Button startIcon={<CreateIcon />} onClick={() => setFootUpdateModal(true)}>Редактировать</Button>
                <Button startIcon={<DeleteIcon />} onClick={() => noteDel(id)}>Удалить</Button>
                {type === 'dev' &&
                <FormControlLabel
                    style={{marginBottom: 0, marginLeft: 5, marginRight: 0}}
                    label='Отклонение'
                    control={<Checkbox color={"primary"}/>}
                    onChange={()=>setFootNote(id)}
                    checked={noteArr.indexOf(id) !== -1}
                />
                }
            </Grid>
        </Grid>
        {footUpdateModal && <UpdateModal id={id} num={num} text={text} setFootUpdateModal={setFootUpdateModal} getAllNotes={getAllNotes}/>}
        </>
    )
}