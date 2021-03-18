import React from "react";
import Axios from "axios";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Paper from "@material-ui/core/Paper/Paper";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import {rowsPerPageCalc} from "./help";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LogModal from './logModal'
import {Create, Pageview} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import TagDialog from './tagDialog';

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

const headCells = [
    { id: 'login', numeric: false, disablePadding: false, label: 'Логин' },
    { id: 'role', numeric: false, disablePadding: false, label: 'Роли' },
    { id: 'ip', numeric: false, disablePadding: false, label: 'IP' },
    { id: 'time', numeric: false, disablePadding: false, label: 'Время' },
    { id: 'tag_name', numeric: false, disablePadding: false, label: 'Тег' },
    { id: 'bd_change', numeric: false, disablePadding: false, label: 'Изменение в БД' },
    { id: 'url', numeric: false, disablePadding: false, label: 'Урл' },
    { id: 'params', numeric: false, disablePadding: false, label: 'Параметры' },
];

export default React.memo(function ApprovedDeviationsTable(props) {
    const {filter, date, changeBd} = props;

    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [rows, setRows] = React.useState([]);
    const [selected, setSelected] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [trash, setTrash] = React.useState(null);
    const [tagDialog, setTagDialog] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        Axios.post('admin/logs', {filter, date, changeBd}).then((response) => {
            setPage(0);
            setRows(response.data.logs);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        });
    }, [filter, date, changeBd]);

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
            <Paper className={classes.paper}>
                {loading ? <LinearProgress/> :
                    <TableContainer style={{maxHeight: document.documentElement.clientHeight - 240}}>
                        <Table
                            stickyHeader={true}
                            aria-labelledby="tableTitle"
                            aria-label="enhanced table"
                        >
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.numeric ? 'right' : 'left'}
                                            padding={headCell.disablePadding ? 'none' : 'default'}
                                        >
                                            {headCell.label}
                                            {headCell.id === 'tag_name' &&
                                            <IconButton style={{marginLeft: 20}} onClick={() => setTagDialog(true)}>
                                                <Create/>
                                            </IconButton>
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
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
                                            <TableCell>{row.login}</TableCell>
                                            <TableCell>{row.user_role}</TableCell>
                                            <TableCell>{row.ip}</TableCell>
                                            <TableCell>{row.time}</TableCell>
                                            <TableCell>{row.tag_name}</TableCell>
                                            <TableCell style={{maxWidth: 50}} align={"center"}>{row.trash > 0 ?
                                                <IconButton onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTrash(row.id);
                                                }}>
                                                    <Pageview/>
                                                </IconButton> :
                                                '-'}</TableCell>
                                            <TableCell>{row.url}</TableCell>
                                            <TableCell style={{whiteSpace: 'pre-wrap'}}>{row.params}</TableCell>
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
            {trash ? <LogModal trash={trash} setTrash={setTrash}/> : null}
            {tagDialog && <TagDialog tagDialog={tagDialog} setTagDialog={setTagDialog}/>}
        </div>
    );
})
