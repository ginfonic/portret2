import React from "react";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {green, red} from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {withStyles} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
    chips: {
        display: 'flex',
        flexWrap: 'wrap'
    },

    chip: {
        margin: 2,
    },

    greenCheckbox: {
        color: green[400],
        '&$checked': {
            color: green[600]
        }
    },
}));

const GreenRedSwitch = withStyles({
    switchBase: {
        color: red[600],
        '&$checked': {
            color: green[600]
        },
        '&$checked + $track': {
            backgroundColor: green[300]
        }
    },

    checked: {},
    track: {},
})(Switch);

export default React.memo(function (props) {
    const classes = useStyles();

    const {selected, setSelected} = props;

    return (
        <React.Fragment>
            <Container maxWidth={"md"}>
                <Card style={{margin: 15, height: '100%', width: '100%'}}>
                    <Grid container spacing={4} style={{margin: 15, height: '100%', width: '100%'}}>
                        <Grid item xs={6}>
                            <TextField
                                label={'Номер запроса'}
                                value={selected.req_num}
                                onChange={event => setSelected({...selected, req_num: event.target.value})}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                            >
                                <KeyboardDatePicker
                                    value={selected.req_date}
                                    label={'Дата запроса'}
                                    placeholder={"день/месяц/год"}
                                    onChange={date => setSelected({...selected, req_date: date})}
                                    format={'dd/MM/yyyy'}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                multiline
                                fullWidth
                                label={'Текст запроса'}
                                value={selected.text}
                                onChange={event => setSelected({...selected, text: event.target.value})}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label={'Номер ответа'}
                                value={selected.answer_num}
                                onChange={event => setSelected({...selected, answer_num: event.target.value})}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    value={selected.answer_send_date}
                                    label={'Дата отправки ответа в ТБ'}
                                    placeholder={"день/месяц/год"}
                                    onChange={date => setSelected({...selected, answer_send_date: date})}
                                    format={'dd/MM/yyyy'}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label={'Ответственный'}
                                value={selected.in_charge_of}
                                onChange={event => setSelected({...selected, in_charge_of: event.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color={"default"}
                                        className={classes.greenCheckbox}
                                        checked={selected.agreement_done}
                                        onChange={() =>
                                            setSelected({...selected, agreement_done: !selected.agreement_done})}
                                    />
                                }
                                label={'Согласование проведено'}
                            />
                        </Grid>
                        {selected.agreement_done &&
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <GreenRedSwitch
                                        checked={selected.refused_or_approved}
                                        onChange={() =>
                                            setSelected(
                                                {
                                                    ...selected,
                                                    refused_or_approved: !selected.refused_or_approved
                                                })
                                        }
                                    />
                                }
                                label={selected.refused_or_approved ? 'Согласовано' : 'Не согласовано'}
                            />
                        </Grid>
                        }
                        {selected.agreement_done &&
                        <Grid item xs={12}>
                            <TextField
                                multiline
                                fullWidth
                                label={'Комментарий к согласованию'}
                                value={selected.final_decision_comments}
                                onChange={event =>
                                    setSelected({...selected, final_decision_comments: event.target.value})}
                            />
                        </Grid>
                        }
                    </Grid>
                </Card>
            </Container>
        </React.Fragment>
    );
})