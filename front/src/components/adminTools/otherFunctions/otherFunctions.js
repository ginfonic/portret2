import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Card from "@material-ui/core/Card/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLoad from './loadScript/mainLoad';
import MainErrorReports from './errorReports/errorReportsMain';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        marginTop: 15,
        position: "relative",
        height: 130,
    },
    button1: {
        left: 15,
        top: 45,
        position: "absolute"
    },
    button2: {
        top: 45,
        left: 480,
        position: "absolute"
    },
    button3: {
        top: 45,
        right: 15,
        position: "absolute"
    }
}));

export default function OtherFunctions() {
    const classes = useStyles();
    const user = useSelector(state => state.mainReducer.user);
    return (
        <Card className={classes.root}>
            <CardHeader
                title="Административная панель"
                />
            <div className={classes.button1}>
                {user.role.id === 14 &&
                    <Link to={process.env.REACT_APP_BASE+'/logs'}>
                        <Button variant={"outlined"}>
                            Таблица логов
                        </Button>
                    </Link>
                }
            </div>
            <div className={classes.button2}>
                <MainErrorReports/>
            </div>
            <div className={classes.button3}>
                <MainLoad/>
            </div>
        </Card>
    );
};