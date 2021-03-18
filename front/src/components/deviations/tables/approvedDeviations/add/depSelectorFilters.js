import React from "react";
import TextField from "@material-ui/core/TextField/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";

const Filter = React.memo((props) => {
    const {label, id, filter, setFilter, banks} = props;

    const [value, setValue] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions]  = React.useState([]);

    React.useEffect(() => {
        Axios.post('deviation_approved/deps_filters', {id, banks}).then((response) => {
            setOptions(response.data.options);
        });
    }, [banks]);

    return <Autocomplete
        value={value}
        onChange={(event, newValue) => {
            setValue(newValue);

            let newFilter = {...filter};
            newFilter[id] = newValue;
            setFilter(newFilter);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
        }}
        id={`menu_search_${id}`}
        options={options}
        fullWidth
        freeSolo
        autoComplete
        includeInputInList
        onSubmit={() => {
            let newFilter = {...filter};
            newFilter[id] = inputValue;
            setFilter(newFilter);
        }}
        onKeyDown={(e) => {
            if (e.keyCode === 13) {
                let newFilter = {...filter};
                newFilter[id] = inputValue;
                setFilter(newFilter);
            }
        }}
        renderInput={(params) =>
            <TextField
                {...params}
                id={`menu_search_${id}`}
                variant="standard"
                placeholder={label}
                fullWidth
                style={{color: '#f6fcff'}}
            />}
    />
});

export default React.memo(function (props) {
    const {filter, setFilter, banks} = props;

    return <div>
        <Typography variant={"h6"}> Фильтры </Typography>
        <p/>

        <Filter id={'depname'} label={'Название'} filter={filter} setFilter={setFilter} banks={banks}/>
        <Filter id={'lvl'} label={'Уровень'} filter={filter} setFilter={setFilter} banks={banks}/>
        <Filter id={'funcblock'} label={'Функциональный блок'} filter={filter} setFilter={setFilter} banks={banks}/>
        <Filter id={'bank'} label={'Банк'} filter={filter} setFilter={setFilter} banks={banks}/>
    </div>
})