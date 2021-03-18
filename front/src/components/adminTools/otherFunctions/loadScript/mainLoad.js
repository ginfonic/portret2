import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import {makeStyles} from "@material-ui/core/styles";
import LoadButton from './loadButton';
import {setErrorReportModal} from "../../../../redux/actions";
import {Close} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    matchButton : {
        marginTop:30
    },
    closeButton: {
        position: "absolute",
        top: 5,
        right: 5
    },
}));

export default React.memo(function () {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return <div className={classes.matchButton}>
        <Button variant="outlined" color="primary" onClick={handleOpen}>
            Скрипты выгрузки данных
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth={"sm"} fullWidth>
            <IconButton
                className={classes.closeButton}
                onClick={handleClose}
            >
                <Close/>
            </IconButton>
            <DialogTitle>
                Скрипты выгрузки данных
            </DialogTitle>
            <DialogContent>
                <LoadButton name={'Таблица численности управления (1-2 уровни) ТБ'} link={'admin/tb_upr_count'}/>
                <p/>
                <LoadButton name={'Таблица численности управления (1-2 уровни) ГОСБ'} link={'admin/gosb_upr_count'}/>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    </div>
});