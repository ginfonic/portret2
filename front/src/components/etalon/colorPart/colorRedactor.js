import React from "react";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import DialogActions from "@material-ui/core/DialogActions";
import {Add} from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import ColorForm from "./colorForm"
import ColorItem from "./colorItem"
import Switch from "@material-ui/core/Switch";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
    text: {
        ...theme.typography.body2,
        backgroundColor: theme.palette.background.paper,
        marginBottom: 5
    },
}));

export default React.memo(function ColorRedactor(props) {
    const classes = useStyles();

    const {openColorRedactor, setOpenColorRedactor} = props;

    const [colorList, setColorList] = React.useState([]);
    const [addColor, setAddColor] = React.useState(false);
    const [main, setMain] = React.useState(true);

    React.useEffect(() => {
        setColorList([]);
        Axios.post('colors/getcolors', {main})
        .then(res => setColorList(res.data));
    }, [main]);

    const handleCloseColorRedactor = () => {
        setOpenColorRedactor(false)
    };

    const addNewColor = () => {
        setAddColor(true)
    };

    return <Dialog open={openColorRedactor} onClose={handleCloseColorRedactor} maxWidth={"sm"} fullWidth>
        <MuiDialogTitle disableTypography style={{margin: 0, padding: 10}}>
            <Grid container>
                <Grid item xs={5}>
                    <Typography variant={"h6"}>
                        Редактирование категорий
                    </Typography>
                </Grid>
                <Grid item xs={7}>
                    <div className={classes.text}>
                        <Switch color={"default"} checked={main} onChange={() => setMain(!main)}/>
                        {main ? `Основные категории` : `Дополнительные категории`}
                    </div>
                    <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={handleCloseColorRedactor}>
                        <CloseIcon/>
                    </IconButton>
                </Grid>
            </Grid>
        </MuiDialogTitle>
        <DialogContent style={{height: 700}}>
            <Divider/>
            <List style={{maxHeight: 700}}>
                {colorList.map((item, index) => <ColorItem
                    item={item}
                    setColorList={setColorList}
                    main={main}
                    key={`${item.id}-${item.index}`}
                />)}
            </List>
        </DialogContent>
        <DialogActions>
            <IconButton onClick={addNewColor} style={{marginBottom: 15, marginRight: 15}}>
                <Add/>
            </IconButton>
            {addColor && <ColorForm addColor={addColor} setAddColor={setAddColor} setColorList={setColorList} main={main}/>}
        </DialogActions>
    </Dialog>
})