import React from 'react';
import { Grid, FormGroup, FormControlLabel,Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

}));

export default function FlatPart(props) {

    const {
        description,
        setDescription,
        id
    } = props;

    const updateFlat = () => {
        axios.post('etalon/flatupdate', {id:id, flat:!description.flat, type:'flat' })
        .then(res => setDescription({...description, flat: !description.flat}))
    }

    return (
        <Grid container>
            <FormGroup row>
                <FormControlLabel
                    control={<Checkbox checked={description.flat} onChange={updateFlat} name="checkedA" />}
                    label="Плоская структура"
                />
            </FormGroup>
        </Grid>
    )
}