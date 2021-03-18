import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import LogsTable from './logs/logsTable';
import LogsFilter from './logs/logsFilter';
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        marginTop: 15,
    },
}));

export default function Logs() {
    const classes = useStyles();

    const [filter, setFilter] = React.useState({ tag: '', url: '', login: '', role: '', ip: '' });
    const [date, setDate] = React.useState({ 'start': new Date().setDate(new Date().getDate() - 7), 'end': null });
    const [changeBd, setChangeBd] = React.useState(false);
    let user = useSelector(state => state.mainReducer.user);

    return <React.Fragment>
        <Container maxWidth={"xl"} className={classes.root}>
            {user.role.id === 22 &&
                <Grid container>
                    <Grid item style={{marginBottom:'10px'}}>
                        <a href='/pkmslogout'>
                        <Button variant="outlined">
                            выход
                        </Button>
                        </a>
                    </Grid>
                </Grid>
            }
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <LogsTable filter={filter} date={date} changeBd={changeBd} />
                </Grid>
                <Grid item xs={2}>
                    <LogsFilter filter={filter} setFilter={setFilter} date={date} setDate={setDate} changeBd={changeBd} setChangeBd={setChangeBd} />
                </Grid>
            </Grid>
        </Container>
    </React.Fragment>
}