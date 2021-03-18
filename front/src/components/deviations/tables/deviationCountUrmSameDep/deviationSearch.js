import React from 'react';
import {TextField, FormControl, FormControlLabel, FormGroup} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';

export default function DeviationSearch(props) {
    const {
        searchDep,
        setSearchDep,
        searchDepName,
        setSearchDepName
    } = props;

    return(
        <>
            <FormGroup row>
                <FormControl>
                    <TextField
                        label="ТБ/ГОСБ"
                        value={searchDep}
                        onChange={(e) => {setSearchDep(e.target.value)}}
                    />
                </FormControl>
                <FormControl style={{marginLeft:20, minWidth:200}} >
                    <TextField
                        label="Подразделение"
                        value={searchDepName}
                        onChange={(e) => {setSearchDepName(e.target.value)}}
                    />
                </FormControl>
            </FormGroup>
        </>
    )
}