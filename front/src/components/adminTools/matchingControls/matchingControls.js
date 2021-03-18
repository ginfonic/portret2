import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Card from "@material-ui/core/Card/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        marginTop: 15,
    },
    button: {
        marginLeft: 15,
        marginBottom: 15,
    }
}));

export default function MatchingControls() {
    const classes = useStyles();

    const [loading, setLoading] = React.useState(false);
    const [loading1, setLoading1] = React.useState(false);

    return (
        <Card className={classes.root}>
            <CardHeader
                title="Настройка метчинга"
            />
            <div className={classes.button}>
                {loading ? <CircularProgress/> :
                    <Button variant={"outlined"} onClick={() => {
                        setLoading(true);
                        axios.get('admin/best_matches').then((res) => {
                            setLoading(false)
                        }).catch(err => {
                            setLoading(false)
                        })
                    }}>
                        Подгрузить лучшие матчи
                    </Button>
                }
            </div>
            <div className={classes.button}>
                {loading1 ? <CircularProgress/> :
                    <Button variant={"outlined"} onClick={() => {
                        setLoading1(true);
                        axios.get('admin/auto_units_intern_error').then((res) => {
                            setLoading1(false)
                        }).catch(err => {
                            setLoading1(false)
                        })
                    }}>
                        Присвоить всем должностям стажера ошибку стажера
                    </Button>
                }
            </div>
        </Card>
    );
};
