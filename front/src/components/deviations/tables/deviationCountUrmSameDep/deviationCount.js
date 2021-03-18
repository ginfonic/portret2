import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FootNoteModal from '../../../footNote/footModal';
import axios from 'axios';
import Grid from "@material-ui/core/Grid";
import Table from "../tableTemplate";

const useStyles = makeStyles((theme) => ({
    root:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        '& > *':{
            margin: theme.spacing(1),
        },
        '& .MuiTextField-root' : {
            margin : theme.spacing(1),
            width: '25ch',
            marginLeft: 10
        }
    }
}));

export default function DeviationCount(props){
    const {type} = props;

    const [request, setRequest] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [sectorValue, setSectorValue] = useState(7);
    const [otdelValue, setOtdelValue] = useState(9);
    const [footModal, setFootModal] = useState(false);
    const [noteArr, setNoteArr] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [filter, setFilter] = React.useState({
        'bank': '',
        'dep': '',
        'funcblock': '',
        'lvl': '',
        'etalon': ''
    });

    const buttonClick = () =>{
        setRequest(true);
        axios.post('deviation_count_urm_samedep/count_update',{sectorValue, otdelValue}).then(res => {
            setRequest(false);
        })};

    const setFootNote = (id) => {
        axios.post('deviation_count_urm_samedep/setfootcount',{id}).then(res => setNoteArr(res.data));};

    useEffect(() => {
        axios.get('deviation_count_urm_samedep/getfootcount').then(res => setNoteArr(res.data));
    },[]);

    useEffect(() => {
        if(type.length > 0){
            setLoading(true);
            axios.post('deviation_count_urm_samedep/count',{filter, type})
            .then(res => {
                setTableData(res.data);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    },[filter, type, request]);

    return(
        <Grid container style={{height: '100%'}}>
            <Grid item xs={6}>
                <ButtonGroup  aria-label='contained primary button group'>
                    <Button onClick={()=> setFootModal(true)} >Исключения сноски</Button>
                    {request ?
                        <Button disabled >Обновление данных</Button>
                        :
                        <Button onClick={buttonClick} >Обновить данные</Button>
                    }
                </ButtonGroup>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    value={sectorValue}
                    label='Численность сектора меньше'
                    variant='outlined'
                    onChange={e=>setSectorValue(e.target.value)}
                    style={{marginRight:'10px'}}
                >
                </TextField>
                <TextField
                    value={otdelValue}
                    label='Численность отдела меньше'
                    variant='outlined'
                    onChange={e=>setOtdelValue(e.target.value)}
                >
                </TextField>
            </Grid>
            <Grid item xs={12}>
                { footModal &&
                <FootNoteModal
                    setFootModal={setFootModal}
                    noteArr={noteArr}
                    setFootNote={setFootNote}
                    type={'dev'}
                />}
                <Table
                    loading={loading}
                    select_structure={type}
                    table={tableData}
                    setFilter={setFilter}
                    id={'count_urm_samedep'}
                    dev_type={'count'}
                />
            </Grid>
        </Grid>
    )
};