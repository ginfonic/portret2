import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import React from "react";
import Axios from "axios";
import List from "@material-ui/core/List";
import {Add} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import TagItem from "./tagItem"
import DialogActions from "@material-ui/core/DialogActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    buttonGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[600],
        marginTop: 12,
        '&:hover': {
            backgroundColor: green[300],
        }
    }
}));

export default React.memo(function (props) {
    const classes = useStyles();

    const {setTagDialog, id, tagRow} = props;

    const [tagList, setTagList] = React.useState([]);
    const [itemConnectedTags, setItemConnectedTags] = React.useState([]);
    const [addTag, setAddTag] = React.useState(false);
    const [newTagName, setNewTagName] = React.useState('');
    const [newTagDescription, setNewTagDescription] = React.useState('');

    React.useEffect(() => {
        Axios.post('deviation_approved/tags', {id}).then((response) => {
            setTagList(response.data.tags);
            setItemConnectedTags(response.data.connected)
        });
    }, []);

    const addNewError = () => {
        setAddTag(true)
    };

    const addNewErrorClose = () => {
        setAddTag(false)
    };

    const handleErrorFormClose = () => {
        setTagDialog(null)
    };

    const changeNewErrorName = (event) => {
        setNewTagName(event.target.value)
    };

    const changeNewErrorDescription = (event) => {
        setNewTagDescription(event.target.value)
    };

    const submitNewError = () => {
        if (newTagName.length > 0) {
            Axios.post('deviation_approved/new_tag', {newTagName, newTagDescription}).then((response) => {
                setTagList(response.data.tags);
            });
        }
        setAddTag(false);
        setNewTagName('');
        setNewTagDescription('');
    };

    const error_list = tagList.map((item, index) => <TagItem
        item={item} itemConnectedTags={itemConnectedTags} setItemConnectedTags={setItemConnectedTags} id={id} key={index} tagRow={tagRow} setTagList={setTagList}
    />);

    return <Dialog open={Boolean(id)} onClose={handleErrorFormClose} maxWidth={"sm"} fullWidth>
        <MuiDialogTitle disableTypography style={{margin: 0, padding: 10}}>
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant={"h6"}>
                        Добавление тега
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={handleErrorFormClose}>
                        <CloseIcon/>
                    </IconButton>
                </Grid>
            </Grid>
        </MuiDialogTitle>
        <DialogContent>
            <List>
                {error_list}
            </List>
        </DialogContent>
        <DialogActions>
            <IconButton onClick={addNewError}>
                <Add/>
            </IconButton>
            <Dialog onClose={addNewErrorClose} open={Boolean(addTag)} maxWidth={"sm"} fullWidth>
                <MuiDialogTitle> Создать новый тег</MuiDialogTitle>
                <DialogContent>
                    <TextField variant={"outlined"} label={"Тег"} value={newTagName} onChange={changeNewErrorName} style={{marginBottom: 10}}/>
                    <TextField variant={"outlined"} label={"Описание"} value={newTagDescription} onChange={changeNewErrorDescription} fullWidth multiline/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={submitNewError} variant={"contained"} className={classes.buttonGreen}>
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </DialogActions>
    </Dialog>
})