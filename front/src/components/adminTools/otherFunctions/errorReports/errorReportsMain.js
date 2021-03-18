import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import {makeStyles} from "@material-ui/core/styles";
import {Close, GetApp} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import red from "@material-ui/core/colors/red";
import Axios from "axios";
import * as XLSX from "xlsx";
import ErrorReportTable from './errorReportsTable';

const useStyles = makeStyles((theme) => ({
    flex: {
        flexgrow: 1
    },
    matchButton : {
        marginTop:30
    },
    closeButton: {
        position: "absolute",
        top: 5,
        right: 5
    },
    redbutton: {
        color: red[300],
        borderColor: red[200],
        '&:hover': {
            backgroundColor: red[50],
            color: red[600],
            borderColor: red[400],
        }
    },
    redbutton2: {
        color: 'white',
        borderColor: red[600],
        backgroundColor: red[600],
        '&:hover': {
            backgroundColor: red[900],
            color: 'white',
            borderColor: red[1000],
        }
    },
}));

export default React.memo(function () {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [openTable, setOpenTable] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenTable(false)
    };

    const download = () => {
        Axios.get('error_report/table').then((response) => {
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';
            let table = response.data.table;
            const ws = XLSX.utils.json_to_sheet(table);
            const wb = {Sheets: {'data': ws}, SheetNames: ['data']};
            const excelBuffer = XLSX.write(wb, {bookType: "xlsx", type: "array"});
            const data = new Blob([excelBuffer], {type: fileType});
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `errorReports(${new Date().toDateString()})` + fileExtension);
            document.body.appendChild(link);
            link.click();
        })
    };

    return <div className={classes.matchButton}>
        <Button variant="outlined" onClick={handleOpen} className={classes.redbutton}>
            Пользовательские сообщения об ошибках
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth={"lg"} fullWidth>
            <IconButton
                className={classes.closeButton}
                onClick={handleClose}
            >
                <Close/>
            </IconButton>
            <DialogTitle>
                Пользовательские сообщения об ошибках
            </DialogTitle>
            <DialogContent>
                {openTable &&
                    <ErrorReportTable/>
                }
            </DialogContent>
            <DialogActions>
                <Button
                    className={classes.redbutton2}
                    variant={"contained"}
                    onClick={() => {
                        setOpenTable(!openTable)
                    }}
                >
                    {openTable ? 'Заркыть таблицу' : 'Открыть таблицу'}
                </Button>
                <Tooltip title={"Загрузить XLSX"}>
                    <IconButton onClick={download}>
                        <GetApp/>
                    </IconButton>
                </Tooltip>
            </DialogActions>
        </Dialog>
    </div>
});