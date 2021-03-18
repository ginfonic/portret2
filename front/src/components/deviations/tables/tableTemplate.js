import React from "react";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {green} from "@material-ui/core/colors";
import TableBody from "@material-ui/core/TableBody";
import {Link} from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField/TextField";
import Axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },

    title: {
        flex: '1 1 100%',
    },

    table: {
        width: '100%',
        height: '100%'
    },

    buttonGreen: {
        color: theme.palette.common.white,
        marginTop: 30,
        backgroundColor: green[600],
        '&:hover': {
            backgroundColor: green[300],
        }
    }
}));

export default React.memo(function SameDepartmentsDeviationsTable(props) {
    const {table, loading, select_structure, setFilter, id, dev_type} = props;

    const classes = useStyles();

    const [searchValue, setSearchValue] = React.useState({'bank': '', 'dep': '', 'funcblock': '', 'lvl': '', 'etalon': ''});
    const [searchInputValue, setSearchInputValue] = React.useState({'bank': '', 'dep': '', 'funcblock': '', 'lvl': '', 'etalon': ''});
    const [filterList, setFilterList] = React.useState({'bank': [], 'dep': [], 'funcblock': [], 'lvl': [], 'etalon': []});

    React.useEffect(() => {
        Axios.post(`deviation_${id}/filter_list`, {select_structure, dev_type}).then((response) => {
            setFilterList(response.data.filter_list);
        });
    }, [select_structure]);

    const autocomplete = (id) => {
        return <Autocomplete
            value={searchValue[id]}
            onChange={(event, newValue) => {
                let new_search_value = {...searchValue};
                new_search_value[id] = newValue;
                setSearchValue(new_search_value);
                setFilter(new_search_value);
            }}
            inputValue={searchInputValue[id]}
            onInputChange={(event, newInputValue) => {
                let new_search_value = {...searchInputValue};
                new_search_value[id] = newInputValue;
                setSearchInputValue(new_search_value);
            }}
            id={`menu_search_${id}`}
            options={filterList[id]}
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
                    id={`menu_search_${id}`}
                    variant="standard"
                    placeholder="Поиск"
                    fullWidth
                    style={{color: '#f6fcff'}}
                />}
        />
    };

    return <Paper className={classes.table}>
        {loading ? <LinearProgress/>:
            <TableContainer style={{maxHeight: document.documentElement.clientHeight - 152}}>
                <Table size={"small"} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding={"default"} align={"center"}>
                                Банк
                                {autocomplete('bank')}
                            </TableCell>
                            <TableCell padding={"default"} align={"center"}>
                                Наименование подразделения
                                {autocomplete('dep')}
                            </TableCell>
                            <TableCell padding={"default"} align={"center"}>
                                Функциональный блок
                                {autocomplete('funcblock')}
                            </TableCell>
                            <TableCell padding={"default"} align={"center"}>
                                Уровень
                                {autocomplete('lvl')}
                            </TableCell>
                            <TableCell padding={"default"} align={"center"}>
                                Название эталонного подразделения
                                {autocomplete('etalon')}
                            </TableCell>
                            {id === 'errors' &&
                            <TableCell padding={"default"} align={"center"}>
                                Ошибки
                            </TableCell>
                            }
                            {id === 'unit_errors' &&
                            <TableCell padding={"default"} align={"center"}>
                                Подразделения + ошибки
                            </TableCell>
                            }
                            {id === 'count_urm_samedep' &&
                            <TableCell padding={"default"} align={"center"}>
                                Численность
                            </TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {table.map((row, index) =>
                            <TableRow key={index}>
                                <TableCell>
                                    {row.bank}
                                </TableCell>
                                <TableCell>
                                    <Link
                                        to={row.link}
                                        target="_blank"
                                    >
                                        {row.depname}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {row.funcblock}
                                </TableCell>
                                <TableCell>
                                    {row.lvl}
                                </TableCell>
                                <TableCell>
                                    {row.etalon_name ? row.etalon_name : '-'}
                                </TableCell>
                                {id === 'errors' &&
                                <TableCell>
                                    {row.error_list.map(item => <p
                                        key={item.name}>{item.name} ({item.description})</p>)}
                                </TableCell>
                                }
                                {id === 'unit_errors' &&
                                <TableCell>
                                    <Table>
                                        <TableBody>
                                            {row.units.map(unit =>
                                                <TableRow key={`${unit.id}-${row.name}`}>
                                                    <TableCell>
                                                        {unit.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {unit.errors.map(item =>
                                                            <p
                                                                key={`${item.name}-${unit.id}-${row.name}`}
                                                            >
                                                                {item.name}
                                                                ({item.description})
                                                            </p>)
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableCell>
                                }
                                {id === 'count_urm_samedep' &&
                                <TableCell>
                                    {row.count}
                                </TableCell>
                                }
                            </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>}
    </Paper>
})