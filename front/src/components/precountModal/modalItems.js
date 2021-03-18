import React, {useState, useEffect} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

export default function ModalItems(props){

    const {
        gosbs,
        checkBoxHeandler,
        checkOrNot
    } = props;

    const [opacity, setOpacity] = useState(0);
    
    useEffect(() => {
        setOpacity(1);
    }, [])
    return(
        <>
        {gosbs.map((gosb, indexGosb) =>
            <FormControlLabel
            key={indexGosb}
            value={gosb}
            style={{opacity:opacity, transition:'1s'}}
            control={
                <Checkbox
                  checkedIcon={<CheckBoxIcon fonsize='small'/>}
                  checked={checkOrNot(gosb)}
                  onChange={e => checkBoxHeandler(e.target.value)}
                  style={{
                      color:'green',
                      padding:'0px',
                      fontSize: '0.9em'
                  }}
                />
            }
            label={gosb}
        />
        )}
        </>
    )
}