import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper/Paper";
import Chip from "@material-ui/core/Chip";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Fab from "@material-ui/core/Fab";
import {CompareArrows, Error, ErrorOutline, Redo, Search} from "@material-ui/icons";
import Menu from "@material-ui/core/Menu/Menu";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add'
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import FilterElem from "./filter_elem"
import ListItemText from "@material-ui/core/ListItemText";
import {green} from "@material-ui/core/colors";
import Zoom from "@material-ui/core/Zoom";
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField";
import Axios from "axios";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },

    greenFab: {
        backgroundColor: green[600],
        '&:hover': {
            backgroundColor: green[300],
        }
    },

    input: {
        margin: 2,
        flex: 1
    },

    divider: {
        height: 24,
    },

    filterbox: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        margin: 0,
    },

    chip: {
        margin: theme.spacing(0.5),
    },

    appbar: {
        backgroundColor: green[600]
    },

    searchbox: {
        margin: theme.spacing(2),
        width: 200
    },

    inputRoot: {
        color: 'white',
    }
}));

export default React.memo(function ListMenu(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [funcblockFilterAnchor, setFuncblockFilterAnchor] = React.useState(null);
    const [lvlFilterAnchor, setLvlFilterAnchor] = React.useState(null);
    const [bankFilterAnchor, setBankFilterAnchor] = React.useState(null);
    const [connectionsAnchor, setConnectionsAnchor] = React.useState(null);
    const [searchValue, setSearchValue] = React.useState(null);
    const [searchInputValue, setSearchInputValue] = React.useState('');
    const [searchList, setSearchList] = React.useState([]);

    const {
        funcblockFilter,
        setFuncblockFilter,
        lvlFilter,
        setLvlFilter,
        connections,
        setConnections,
        funcblock,
        lvl,
        setChosen,
        searchFilter,
        setSearchFilter,
        id,
        flags,
        setFlags,
        setAdd,
        select_structure,
        connected,
        banks,
        bankFilter,
        setBankFilter,
        mass
    } = props;

    const errorFilterFlag = () => {
        setFlags({...flags, error_flag: true});
        setAnchorEl(null);
    };

    const errorUnitFilterFlag = () => {
        setFlags({...flags, error_unit_flag: true});
        setAnchorEl(null);
    };

    const returnLaterFilterFlag = () => {
        setFlags({...flags, return_later: true});
        setAnchorEl(null);
    };

    const unitsReturnLaterFilterFlag = () => {
        setFlags({...flags, units_return_later: true});
        setAnchorEl(null);
    };

    const notMatchedFilterFlag = () => {
        setFlags({...flags, not_matched: true});
        setAnchorEl(null);
    };

    const deleteErrorFilterFlag = () => {
        setFlags({...flags, error_flag: false})
    };

    const deleteErrorUnitFilterFlag = () => {
        setFlags({...flags, error_unit_flag: false})
    };

    const deleteReturnLaterFilterFlag = () => {
        setFlags({...flags, return_later: false})
    };

    const deleteUnitsReturnLaterFilterFlag = () => {
        setFlags({...flags, units_return_later: false})
    };

    const deleteNotMatchedFilterFlag = () => {
        setFlags({...flags, not_matched: false})
    };

    const handleSearchSubmit = () => {
        setSearchFilter(searchInputValue);
    };

    const handleDelete = (elemToDelete) => () => {
        setFuncblockFilter((filter) => filter.filter((elem) => elem !== elemToDelete));
        setLvlFilter((filter) => filter.filter((elem) => elem !== elemToDelete));
        if (id === "sap_menu") setBankFilter((filter) => filter.filter((elem) => elem !== elemToDelete));
        if (id === "etalon_menu") setConnections((filter) => filter.filter((elem) => elem !== elemToDelete));
    };

    const handleDeleteSearch = () => {
        setSearchFilter('');
        setSearchInputValue('');
    };

    const deleteFilters = () => () => {
        setFuncblockFilter([]);
        setLvlFilter([]);
        setBankFilter([]);
        setSearchFilter('');
        setSearchInputValue('');
        if (id === "sap_menu") setFlags({return_later: false, error_flag: false, not_matched: false});
    };

    const handleAddFilterMouseOn = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAddFilterClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        Axios.post(`match/search_list_${id}`,
            {select_structure, funcblockFilter, lvlFilter, flags, connections, connected, mass}).then((response) => {
            setSearchList(response.data.searchList)
        });
    }, [funcblockFilter, lvlFilter, flags, connected, connections, select_structure, id]);

    const ref = React.createRef();

    return <div id={id}>
        {funcblockFilter.length > 0 && lvlFilter > 0 ? <Divider/> : null}

        <Paper component="ul" className={classes.filterbox}>
            {funcblockFilter.map((elem) => {
                return (
                    <li key={elem}>
                        <Chip
                            label={elem}
                            onDelete={handleDelete(elem)}
                            className={classes.chip}
                        />
                    </li>
                );
            })}
            {lvlFilter.map((elem) => {
                return (
                    <li key={elem}>
                        <Chip
                            label={`lvl: ${elem}`}
                            onDelete={handleDelete(elem)}
                            className={classes.chip}
                        />
                    </li>
                );
            })}
            {id === "sap_menu" && bankFilter.map((elem) => {
                return (
                    <li key={elem}>
                        <Chip
                            label={elem}
                            onDelete={handleDelete(elem)}
                            className={classes.chip}
                        />
                    </li>
                );
            })}
            {id === "etalon_menu" ? connections.map((elem) => {
                return (
                    <li key={elem}>
                        <Chip
                            label={`Связи: ${elem}`}
                            onDelete={handleDelete(elem)}
                            className={classes.chip}
                        />
                    </li>
                );
            }) : null}
            {Boolean(searchFilter) ? <li key={searchFilter}>
                <Chip
                    label={`"${searchFilter}"`}
                    onDelete={handleDeleteSearch}
                    className={classes.chip}
                />
            </li> : null}
            {id === "sap_menu" ? flags.return_later ? <li key="return_later">
                <Chip
                    label="Вернуться позже к подразделению(флаг)"
                    onDelete={deleteReturnLaterFilterFlag}
                    className={classes.chip}
                />
            </li> : null : null}
            {id === "sap_menu" ? flags.units_return_later ? <li key="units_return_later">
                <Chip
                    label="Вернуться позже к должностям(флаг)"
                    onDelete={deleteUnitsReturnLaterFilterFlag}
                    className={classes.chip}
                />
            </li> : null : null}
            {id === "sap_menu" ? flags.error_unit_flag ? <li key="error_unit_flag">
                <Chip
                    label="Ошибка в должностях(флаг)"
                    onDelete={deleteErrorUnitFilterFlag}
                    className={classes.chip}
                />
            </li> : null : null}
            {id === "sap_menu" ? flags.error_flag ? <li key="error_flag">
                <Chip
                    label="Ошибка в подразделении(флаг)"
                    onDelete={deleteErrorFilterFlag}
                    className={classes.chip}
                />
            </li> : null : null}
            {id === "sap_menu" ? flags.not_matched ? <li key="not_matched">
                <Chip
                    label="Не найдены совпадения(флаг)"
                    onDelete={deleteNotMatchedFilterFlag}
                    className={classes.chip}
                />
            </li> : null : null}
        </Paper>
        <Divider/>
        <AppBar position="static" className={classes.appbar}>
                <Grid container spacing={1}>
                    <Grid item xs={7}>
                        <Toolbar style={{padding: 2, paddingLeft: 5}}>

                            {<Autocomplete
                                value={searchValue}
                                onChange={(event, newValue) => {
                                    setSearchValue(newValue)
                                }}
                                inputValue={searchInputValue}
                                onInputChange={(event, newInputValue) => {
                                    setSearchInputValue(newInputValue)
                                }}
                                id={`menu_search_${id}`}
                                options={searchList}
                                fullWidth
                                freeSolo
                                autoComplete
                                includeInputInList
                                onSubmit={handleSearchSubmit}
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        handleSearchSubmit()
                                    }
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        id={`menu_search_${id}`}
                                        variant="standard"
                                        placeholder="Поиск"
                                        fullWidth
                                        style={{color: '#f5fdff'}}
                                    />}
                             />
                            }

                        </Toolbar>

                    </Grid>

                    <Grid item xs={5}>
                        <Toolbar style={{padding: 2}}>

                            <div className={classes.grow} />

                            <Tooltip placement="top" title="Search" aria-label="search" TransitionComponent={Zoom}>
                                <Fab size="small" color="inherit" aria-label="search" onClick={handleSearchSubmit} className={classes.greenFab}>
                                    <Search />
                                </Fab>
                            </Tooltip>

                            <div className={classes.grow} />

                            <Divider orientation="vertical" className={classes.divider}/>

                            <div className={classes.grow} />

                            <Tooltip placement="top" title="Add filter" aria-label="add" TransitionComponent={Zoom}>
                                <Fab size="small" onClick={handleAddFilterMouseOn} className={classes.fab}>
                                    <AddIcon/>
                                </Fab>
                            </Tooltip>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleAddFilterClose}
                            >
                                <FilterElem
                                    ref={ref}
                                    name={"Функциональный блок"}
                                    filter={funcblockFilter}
                                    filter_array={funcblock}
                                    setFilter={setFuncblockFilter}
                                    setChosen={setChosen}
                                    setAnchorEl={setAnchorEl}
                                    filterAnchor={funcblockFilterAnchor}
                                    setFilterAnchor={setFuncblockFilterAnchor}
                                    setAdd={setAdd}
                                    id={id}/>
                                {<FilterElem
                                    ref={ref}
                                    name={"Уровень"}
                                    filter={lvlFilter}
                                    filter_array={lvl}
                                    setFilter={setLvlFilter}
                                    setChosen={setChosen}
                                    setAnchorEl={setAnchorEl}
                                    filterAnchor={lvlFilterAnchor}
                                    setFilterAnchor={setLvlFilterAnchor}
                                    setAdd={setAdd}
                                    id={id}/>}
                                {id === "sap_menu" && <FilterElem
                                    ref={ref}
                                    name={"Банк"}
                                    filter={bankFilter}
                                    filter_array={banks}
                                    setFilter={setBankFilter}
                                    setChosen={setChosen}
                                    setAnchorEl={setAnchorEl}
                                    filterAnchor={bankFilterAnchor}
                                    setFilterAnchor={setBankFilterAnchor}
                                    setAdd={setAdd}
                                    id={id}/>}
                                {id === "sap_menu" ? <ListItem
                                    selected={flags.error_flag}
                                    button onClick={errorFilterFlag}
                                    key="Ошибка в подразделении"
                                    value="Ошибка в подразделении">
                                    <ListItemIcon>
                                        <Error/>
                                    </ListItemIcon>
                                    <ListItemText primary="Ошибка в подразделении"/>
                                </ListItem> : null}
                                {id === "sap_menu" ? <ListItem
                                    selected={flags.error_unit_flag}
                                    button onClick={errorUnitFilterFlag}
                                    key="Ошибка в должностях"
                                    value="Ошибка в должностях">
                                    <ListItemIcon>
                                        <ErrorOutline/>
                                    </ListItemIcon>
                                    <ListItemText primary="Ошибка в должностях"/>
                                </ListItem> : null}
                                {id === "sap_menu" ? <ListItem
                                    selected={flags.return_later}
                                    button onClick={returnLaterFilterFlag}
                                    key="Вернуться позже к подразделению"
                                    value="Вернуться позже к подразделению">
                                    <ListItemIcon>
                                        <Redo/>
                                    </ListItemIcon>
                                    <ListItemText primary="Вернуться позже к подразделению"/>
                                </ListItem> : null}
                                {id === "sap_menu" ? <ListItem
                                    selected={flags.units_return_later}
                                    button onClick={unitsReturnLaterFilterFlag}
                                    key="Вернуться позже к должностям"
                                    value="Вернуться позже к должностям">
                                    <ListItemIcon>
                                        <Redo/>
                                    </ListItemIcon>
                                    <ListItemText primary="Вернуться позже к должностям"/>
                                </ListItem> : null}
                                {id === "sap_menu" ? <ListItem
                                    selected={flags.not_matched}
                                    button onClick={notMatchedFilterFlag}
                                    key="Не найдены совпадения"
                                    value="Не найдены совпадения">
                                    <ListItemIcon>
                                        <CompareArrows/>
                                    </ListItemIcon>
                                    <ListItemText primary="Не найдены совпадения"/>
                                </ListItem> : null}
                                {id === "etalon_menu" ? <FilterElem
                                        name="Количество связей"
                                        filter={connections}
                                        filter_array={['Отсутствуют', 'Есть', 'Больше 10']}
                                        setFilter={setConnections}
                                        setChosen={setChosen}
                                        setAnchorEl={setAnchorEl}
                                        filterAnchor={connectionsAnchor}
                                        setFilterAnchor={setConnectionsAnchor}
                                        setAdd={setAdd}
                                        id={id}/>
                                    : null}
                            </Menu>

                            <div className={classes.grow} />

                            <Tooltip placement="top" title="Delete all filters" aria-label="delete" TransitionComponent={Zoom}>
                                <Fab size="small" color="secondary" aria-label="delete" onClick={deleteFilters()} className={classes.fab}>
                                    <DeleteIcon />
                                </Fab>
                            </Tooltip>

                            <div className={classes.grow} />

                        </Toolbar>
                    </Grid>
                </Grid>
        </AppBar>
    </div>
})