import React from "react";
import TextField from "@material-ui/core/TextField/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import Axios from "axios";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const Filter = React.memo((props) => {
    const {label, id, filter, setFilter} = props;

    const [value, setValue] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions]  = React.useState([]);

    React.useEffect(() => {
        Axios.post('admin/logs_filter_options', {id}).then((response) => {
            setOptions(response.data.options);
        });
    }, [id]);

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
    const {filter, setFilter, date, setDate, changeBd, setChangeBd} = props;

    return <div>

        <Typography variant={"h6"}> Фильтры </Typography>
        <p/>

        <Filter id={'login'} label={'Логин'} filter={filter} setFilter={setFilter}/>
        <Filter id={'role'} label={'Роль'} filter={filter} setFilter={setFilter}/>
        <Filter id={'ip'} label={'IP'} filter={filter} setFilter={setFilter}/>
        <Filter id={'url'} label={'Урл'} filter={filter} setFilter={setFilter}/>
        <Filter id={'tag'} label={'Тег'} filter={filter} setFilter={setFilter}/>

        <p/>

        <Typography variant={"h6"}> Сортировка по дате </Typography>
        <p/>

        <Typography variant={"subtitle1"}>Дата и время начала</Typography>
        <p/>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker value={date['start']} label={'Выбор даты'}
                                placeholder={"день/месяц/год"}
                                clearable
                                onChange={new_date => setDate({...date, 'start': new_date === null ? null : new_date.toString()})}
                                format={'dd/MM/yyyy'}
            />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker value={date['start']} label={'Выбор времени'}
                                clearable
                                ampm={false}
                                onChange={new_time => setDate({...date, 'start': new_time === null ? null : new_time.toString()})}
            />
        </MuiPickersUtilsProvider>

        <p/>

        <Typography variant={"subtitle1"}>Дата и время конца</Typography>
        <p/>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker value={date['end']} label={'Выбор даты'}
                                placeholder={"день/месяц/год"}
                                clearable
                                onChange={new_date => setDate({...date, 'end': new_date === null ? null : new_date.toString()})}
                                format={'dd/MM/yyyy'}
            />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker value={date['end']} label={'Выбор времени'}
                                clearable
                                ampm={false}
                                onChange={new_time => setDate({...date, 'end': new_time === null ? null : new_time.toString()})}
            />
        </MuiPickersUtilsProvider>

        <p/>

        <FormGroup row>
            <FormControlLabel
                control={<Checkbox checked={changeBd} onChange={() => {setChangeBd(!changeBd)}}/>}
                label={"Только изменение в БД"}
            />
        </FormGroup>
    </div>
})