import React from "react";
import Axios from "axios";
import Typography from "@material-ui/core/Typography";
import {Add, Create, Delete} from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/core/SvgIcon/SvgIcon";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {green} from "@material-ui/core/colors";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },

    title: {
        flex: '1 1 100%',
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

export default React.memo(function EnhancedTableToolbar(props) {
    const classes = useToolbarStyles();

    const {setAdd, selected, setSelected, setRows, filter, setRedact} = props;

    const [deleteRow, setDeleteRow] = React.useState(false);

    const handleDelete = () => {
        Axios.post('deviation_approved/delete', {selected, filter}).then((response) => {
            if (response.data.result === 'ok') {
                setDeleteRow(false);
                setSelected([]);
                setRows(response.data.table);
            }
        });
    };

    return (
        <Toolbar
            className={classes.root}
        >
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                Согласованные отклонения
            </Typography>

            {selected.length === 1 &&
            <Tooltip title="Редактировать">
                <IconButton aria-label="redact" onClick={() => {
                    setRedact(selected[0]);
                    setAdd(true);
                }}>
                    <Create/>
                </IconButton>
            </Tooltip>
            }

            {selected.length > 0 &&
            <Tooltip title="Удалить выбранные">
                <IconButton aria-label="delete" onClick={() => setDeleteRow(true)}>
                    <Delete/>
                </IconButton>
            </Tooltip>
            }

            {deleteRow &&
            <Dialog onClose={() => setDeleteRow(false)} open={deleteRow} maxWidth={"xs"} fullWidth>
                <MuiDialogTitle disableTypography style={{margin: 0, padding: 10}}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant={"h6"}>
                                Вы уверены?
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <IconButton style={{position: "absolute", top: 5, right: 5}}
                                        onClick={() => setDeleteRow(false)}>
                                <CloseIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </MuiDialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleteRow(false)} variant={"contained"} className={classes.buttonGreen}>
                        Нет
                    </Button>
                    <Button onClick={handleDelete} variant={"outlined"} color={"secondary"} style={{marginTop: 30}}>
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
            }

            <Tooltip title="Добавить">
                <IconButton aria-label="add" onClick={() => setAdd(true)}>
                    <Add/>
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
});