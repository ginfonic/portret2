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

    const {tagDialog, setTagDialog} = props;

    const [tagList, setTagList] = React.useState([]);
    const [addTag, setAddTag] = React.useState(false);
    const [newTagName, setNewTagName] = React.useState('');
    const [newTagId, setNewTagId] = React.useState('');

    React.useEffect(() => {
        Axios.post('admin/logs_tags', {}).then((response) => {
            setTagList(response.data.tags);
        });
    }, []);

    const addNewError = () => {
        setAddTag(true)
    };

    const addNewErrorClose = () => {
        setAddTag(false)
    };

    const changeNewTagName = (event) => {
        setNewTagName(event.target.value)
    };

    const changeNewTagId = (event) => {
        setNewTagId(event.target.value)
    };

    const submitNewTag = () => {
        if (newTagName.length > 0) {
            Axios.post('admin/logs_new_tag', {newTagName, newTagId}).then((response) => {
                setTagList(response.data.tags);
            });
        }
        setAddTag(false);
        setNewTagName('');
        setNewTagId('');
    };

    const tag_list = tagList.map((item, index) => <TagItem
        item={item} key={index} setTagList={setTagList}
    />);

    return <Dialog open={tagDialog} onClose={() => setTagDialog(false)} maxWidth={"sm"} fullWidth>
        <MuiDialogTitle disableTypography style={{margin: 0, padding: 10}}>
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant={"h6"}>
                        Редактирование тегов
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={() => setTagDialog(false)}>
                        <CloseIcon/>
                    </IconButton>
                </Grid>
            </Grid>
        </MuiDialogTitle>
        <DialogContent style={{maxHeight: 800}}>
            <List>
                {tag_list}
            </List>
        </DialogContent>
        <DialogActions>
            <IconButton onClick={addNewError}>
                <Add/>
            </IconButton>
            <Dialog onClose={addNewErrorClose} open={Boolean(addTag)} maxWidth={"sm"} fullWidth>
                <MuiDialogTitle> Создать новый тег</MuiDialogTitle>
                <DialogContent>
                    <TextField variant={"outlined"} label={"Тег"} value={newTagName} onChange={changeNewTagName} style={{marginBottom: 10}} fullWidth multiline/>
                    <TextField variant={"outlined"} label={"Id"} value={newTagId} onChange={changeNewTagId} type={"number"}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={submitNewTag} variant={"contained"} className={classes.buttonGreen}>
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </DialogActions>
    </Dialog>
})