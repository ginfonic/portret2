import React from "react";
import Axios from "axios";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import {FilterList} from "@material-ui/icons";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";


const headCells = [
    { id: 'banks', numeric: false, disablePadding: false, label: 'Банк' },
    { id: 'deps', numeric: false, disablePadding: false, label: 'Подразделение' },
    { id: 'text', numeric: false, disablePadding: false, label: 'Текст запроса' },
    { id: 'tags', numeric: false, disablePadding: false, label: 'Тег' },
    { id: 'req_num', numeric: false, disablePadding: false, label: 'Номер запроса' },
    { id: 'req_date', numeric: false, disablePadding: false, label: 'Дата запроса' },
    { id: 'answer_num', numeric: false, disablePadding: false, label: 'Номер ответа' },
    { id: 'answer_date', numeric: false, disablePadding: false, label: 'Дата отправки ответа в ТБ' },
    { id: 'in_charge_of', numeric: false, disablePadding: false, label: 'Ответственный' },
    { id: 'agreement_done', numeric: false, disablePadding: false, label: 'Рассмотренно' },
    { id: 'refused_or_approved', numeric: false, disablePadding: false, label: 'Статус согласования' },
    { id: 'final_decision_comment', numeric: false, disablePadding: false, label: 'Комментарий к согласованию' },
];

export default React.memo(function EnhancedTableHead(props) {
    const {order, orderBy, setFilter, searchValue, setSearchValue, searchInputValue, setSearchInputValue} = props;

    const [searchList, setSearchList] = React.useState({'banks': [], 'deps': [], 'tags': []});

    React.useEffect(() => {
        let isMounted = true;
        Axios.get('deviation_approved/search_list').then((response) => {
            if (isMounted) {
                setSearchList(response.data.search_list)
            }
        }).catch(err => {
            console.log(err)
        });
        return () => {isMounted = false};
    }, []);

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {(headCell.id === 'banks' || headCell.id === 'deps' || headCell.id === 'tags') && searchList ?
                            <div>
                                {headCell.label}
                                <Grid container>
                                    <Grid item xs={9}>
                                        <Autocomplete
                                            value={searchValue[headCell.id]}
                                            onChange={(event, newValue) => {
                                                let new_search_value = {...searchValue};
                                                new_search_value[headCell.id] = newValue;
                                                setSearchValue(new_search_value);
                                                setFilter(new_search_value);
                                            }}
                                            inputValue={searchInputValue[headCell.id]}
                                            onInputChange={(event, newInputValue) => {
                                                let new_search_value = {...searchInputValue};
                                                new_search_value[headCell.id] = newInputValue;
                                                setSearchInputValue(new_search_value);
                                            }}
                                            id={`menu_search_${headCell.id}`}
                                            options={searchList[headCell.id]}
                                            fullWidth
                                            freeSolo
                                            autoComplete
                                            includeInputInList
                                            onSubmit={() => {setFilter(searchInputValue);}}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13) {
                                                    setFilter(searchInputValue);
                                                }
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    id={`menu_search_${headCell.id}`}
                                                    variant="standard"
                                                    placeholder={headCell.label}
                                                    fullWidth
                                                    style={{color: '#f6fcff'}}
                                                />}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip title={'Добавить фильтр'}>
                                            <IconButton onClick={() => {
                                                setFilter(searchInputValue);
                                            }}>
                                                <FilterList/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </div>
                            :
                            headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
});