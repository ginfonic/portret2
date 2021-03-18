import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 15,
    },
    card: {
        marginBottom: 15,
        width: "100%"
    }
}));

export default function FieldErrorCard(props) {
    const classes = useStyles();

    const {item, bank} = props;

    const [action, setAction] = React.useState(0);
    const [changeTo, setChangeTo] = React.useState('');
    const [load, setLoad] = React.useState(false);

    React.useEffect(() => {
        axios.post('admin/fields_validation_get', {
            name: item.name,
            index: item.index,
            bank
        }).then(res => {
            setAction(res.data.action);
            setChangeTo(res.data.changeTo);
            setLoad(true);
        })
    }, []);

    React.useEffect(() => {
        if (load) {
            if (action === 2 || (action === 1 && changeTo.length > 0)) {
                axios.post('admin/fields_validation_set', {
                    type: action,
                    name: item.name,
                    index: item.index,
                    changeTo,
                    bank
                }).then(() => {
                }).catch(() => {
                    setLoad(false);
                    setAction(0);
                    setChangeTo('');
                });
                setLoad(true);
            }
        }
    }, [changeTo, action]);

    return (
        <Card className={classes.card}>
            <Grid container>
                <Grid item xs={6} className={classes.root}>
                    <Typography variant="h6">
                        {item.name} ({item.index})
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <FormControl>
                        <InputLabel>
                            Выберите действие
                        </InputLabel>
                        <Select
                            value={action}
                            style={{minWidth: 200}}
                            onChange={(e) => {
                                setAction(e.target.value);
                            }}
                        >
                            <MenuItem value={0}>Ничего не делать</MenuItem>
                            <MenuItem value={1}>Заменить на...</MenuItem>
                            <MenuItem value={2}>Обозначить как ВСП</MenuItem>
                        </Select>
                    </FormControl>
                    {action === 1 &&
                    <FormControl style={{marginLeft: 15}}>
                        <InputLabel>
                            Выберите вариант для замены
                        </InputLabel>
                    <Select
                        value={changeTo}
                        style={{minWidth: 300}}
                        onChange={(e) => {
                            setChangeTo(e.target.value);
                        }}
                    >
                        {item.variants.map(name =>
                            <MenuItem value={name}>{name}</MenuItem>
                        )}
                    </Select>
                    </FormControl>
                    }
                </Grid>
            </Grid>
        </Card>
    )
}
