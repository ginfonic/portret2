import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FootNoteModal from '../../../footNote/footModal';
import axios from 'axios';
import Grid from "@material-ui/core/Grid";
import Table from '../tableTemplate';

export default function DeviationUrm(props) {
    const {type} = props;

    const [request, setRequest] = useState(false);
    const [tableData, setTableData] = useState([]);
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
        axios.get('deviation_count_urm_samedep/urm_update',).then(res => {
            setRequest(false);
        })
    };

    useEffect(() => {
        if(type.length > 0) {
            setLoading(true);
            axios.post('deviation_count_urm_samedep/urm',{filter, type}).then(res => {
                setTableData(res.data);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    },[filter, type, request]);

    const setFootNote = (id) => {
        axios.post('deviation_count_urm_samedep/setfooturm',{id}).then(res => setNoteArr(res.data));
    };

    useEffect(() => {
        axios.get('deviation_count_urm_samedep/getfooturm',{}).then(res => setNoteArr(res.data));
    },[]);

    return(
        <Grid container style={{height: '100%'}}>
            <Grid item xs={12}>
                <ButtonGroup  aria-label='contained primary button group'>
                    <Button onClick={()=> setFootModal(true)}>Исключения сноски №</Button>
                    {request ?
                        <Button disabled >Ожидание данных...</Button>
                        :
                        <Button onClick={buttonClick} >Обновить данные</Button>
                    }
                </ButtonGroup>
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
                    dev_type={'urm'}
                />
            </Grid>
        </Grid>
    );
}