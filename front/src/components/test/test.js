import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

export default function Testpage(){
    useEffect(()=>{
        axios.post('test',{data:'test'})
    },[])
    return(
        <Grid container>Test pagennnnnnnnnnnnnn</Grid>
    )
}