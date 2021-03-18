import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';



export default function SelectGosbTb(props){
    const {
        setSelected
    } = props;

    const [depsSearch, setDepsSearch] = useState([]);
    


       useEffect(() => {
        axios.post('structure/getdeps')
        .then(res => setDepsSearch(res.data))
       }, []);

    return(
        <Autocomplete
            id='depAutocomplite'
            options={depsSearch}
            getOptionLabel={option => option.name}
            style={{width:450}}
            onChange={(e, newValue) => { newValue === null ? setSelected({name:'', type: ''}) : setSelected({name:newValue.name, type:newValue.type})}}
            renderInput={params => <TextField {...params} label='Выбор ТБ/ГОСБ'/>}
        />
    )
    
}