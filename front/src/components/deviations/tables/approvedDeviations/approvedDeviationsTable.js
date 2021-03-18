import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {Add, CheckCircleOutline, Create, RadioButtonUnchecked} from "@material-ui/icons";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import {descendingComparator, rowsPerPageCalc} from "./help";
import AddDeviation from './add/addDeviation'
import Axios from "axios";
import Chip from "@material-ui/core/Chip";
import LinearProgress from "@material-ui/core/LinearProgress";
import TagDialog from './tagDialog';
import {Link} from "react-router-dom";
import {Link as LinkIcon} from "@material-ui/icons";
import DepChip from './depChip';
import EnhancedTableHead from './enhancedTableHead';
import EnhancedTableToolbar from './enhancedTableToolbar';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default React.memo(function ApprovedDeviationsTable(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [add, setAdd] = React.useState(false);
    const [redact, setRedact] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [selected, setSelected] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [filter, setFilter] = React.useState({'banks': '', 'deps': '', 'tags': ''});
    const [searchValue, setSearchValue] = React.useState({'banks': '', 'deps': '', 'tags': ''});
    const [searchInputValue, setSearchInputValue] = React.useState({'banks': '', 'deps': '', 'tags': ''});
    const [tagDialog, setTagDialog] = React.useState(null);
    const [tagRow, setTagRow] = React.useState(null);

    React.useEffect(() => {
        setLoading(true);
        Axios.post('deviation_approved/table', {filter}).then((response) => {
            setLoading(false);
            setRows(response.data.table);
        }).catch(err => {
            setLoading(false);
        });
    }, [filter]);

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    return (
        <div className={classes.root}>
            {add &&
            <AddDeviation
                add={add}
                setAdd={setAdd}
                redact={redact}
                setRedact={setRedact}
                setRows={setRows}
                filter={filter}
            />}
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    setAdd={setAdd}
                    setRows={setRows}
                    selected={selected}
                    setSelected={setSelected}
                    filter={filter}
                    setRedact={setRedact}
                />
                {loading ? <LinearProgress/> :
                    <TableContainer>
                        <Table
                            aria-labelledby="tableTitle"
                            aria-label="enhanced table"
                            size={"small"}
                        >
                            <EnhancedTableHead
                                classes={classes}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                                setFilter={setFilter}
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                searchInputValue={searchInputValue}
                                setSearchInputValue={setSearchInputValue}
                            />
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell>
                                                    <div>
                                                        {
                                                            row.banks.map(bank => (
                                                                <Link
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    to={bank.link_to}
                                                                    target="_blank"
                                                                    key={bank.name}
                                                                >
                                                                    <Chip
                                                                        key={bank.name}
                                                                        label={bank.name}
                                                                        icon={<LinkIcon/>}
                                                                        clickable
                                                                    />
                                                                </Link>)
                                                            )
                                                        }
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        {
                                                            row.deps.map((item, index) => {
                                                                return <DepChip item={item} key={index}/>
                                                            })
                                                        }
                                                    </div>
                                                </TableCell>
                                                <TableCell>{row.text}</TableCell>
                                                <TableCell>{row.tags.length > 0 ?
                                                    <div>
                                                        {row.tags.map((item) =>
                                                            <Chip
                                                                key={item}
                                                                label={`#${item}`}
                                                            />)
                                                        }
                                                        <IconButton
                                                            size={"small"}
                                                            onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTagDialog(row.id);
                                                            setTagRow(row);
                                                            }}
                                                        >
                                                            <Create/>
                                                        </IconButton>
                                                </div>
                                                    :
                                                    <IconButton size={"small"} onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTagDialog(row.id);
                                                        setTagRow(row);
                                                    }}>
                                                        <Add/>
                                                    </IconButton>}
                                                </TableCell>
                                                <TableCell>{row.req_num}</TableCell>
                                                <TableCell>{row.req_date !== null && row.req_date.slice(0, row.req_date.indexOf('T'))}</TableCell>
                                                <TableCell>{row.answer_num}</TableCell>
                                                <TableCell>{row.answer_send_date !== null && row.answer_send_date.slice(0, row.answer_send_date.indexOf('T'))}</TableCell>
                                                <TableCell>{row.in_charge_of}</TableCell>
                                                <TableCell>{row.agreement_done ? <CheckCircleOutline/> :
                                                    <RadioButtonUnchecked/>}</TableCell>
                                                <TableCell>{row.agreement_done ? row.refused_or_approved ? 'Согласовано' : 'Отказ' : '-'}</TableCell>
                                                <TableCell>{row.agreement_done ? row.final_decision_comments.length > 0 ? row.final_decision_comments : '-' : '-'}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
                <TablePagination
                    rowsPerPageOptions={rowsPerPageCalc(rows.length)}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            {tagDialog ? <TagDialog id={tagDialog} setTagDialog={setTagDialog} tagRow={tagRow}/> : null}
        </div>
    );
})
