import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import {
    CompareArrows,
    Done
} from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ElemToggled from "./elem_toggled"
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
    needmatch: {
        overflow: 'auto',
        backgroundColor: '#ffe5e6'
    },

    matched: {
        overflow: 'auto',
        backgroundColor: '#ecffed'
    },

    nested: {
        paddingLeft: theme.spacing(2),
        textAlign: 'left',
    },

    selected: {
        color: '#3ada3b',
        backgroundColor: '#97da97'
    },

    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

function bank_icon(bank) {
    if (bank === 'Сибирский банк') return 'СИБ';
    else if (bank === 'Среднерусский банк') return 'СРБ';
    else if (bank === 'Дальневосточный банк') return 'ДВБ';
    return bank.toUpperCase().split(new RegExp('[\ \-]')).map(item => item[0])
}

export default React.memo(function SapListElem(props) {
    const classes = useStyles();

    const {item, checked, setChecked, select_structure, handleRefresh, setMatching, setFakeChosen, mass, index
        //style
    } = props;

    const [itemForm, setItemForm] = React.useState(false);

    const handleCheckNoMass = (id) => () => {
        const currentIndex = checked.indexOf(id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleCheckMass = (item) => () => {
        let newChecked = [...checked];

        if (newChecked.filter(ch =>
            ch.depname === item.depname &&
            ch.lvl === item.lvl &&
            ch.funcblock === item.funcblock &&
            ch.connectedto === item.connectedto).length === 0) {
            newChecked.push(item);
        }
        else {
            newChecked = newChecked.filter(ch =>
                ch.depname !== item.depname &&
                ch.lvl !== item.lvl &&
                ch.funcblock !== item.funcblock &&
                ch.connectedto !== item.connectedto)
        }

        setChecked(newChecked);
    };

    return <div>
        <div>
            <ListItem
                className={!Boolean(item.connectedto) ? classes.needmatch : classes.matched}
                classes={{
                    selected: classes.selected
                }}
                key={index}
                button
                onClick={() => setItemForm(true)}
                id={`sap-${index}`}
                //style={style}
            >
                <ListItemIcon>
                    {item.lvl}
                </ListItemIcon>
                {
                    !mass &&
                    <ListItemIcon>
                        {bank_icon(item.bank)}
                    </ListItemIcon>
                 }
                <ListItemText primary={`${item.depname}${mass ? ` (${item.deps.length})` : ''}`} />
                <ListItemIcon>
                    {!Boolean(item.connectedto) ? <CompareArrows/> : <Done/>}
                </ListItemIcon>
                <ListItemSecondaryAction //style={{position: style && style.position, top: style && style.top + 40}}
                >
                    <Checkbox
                        edge="end"
                        onChange={mass ? handleCheckMass(item) : handleCheckNoMass(item.id)}
                        checked={mass ? checked.filter(ch =>
                            ch.depname === item.depname &&
                            ch.lvl === item.lvl &&
                            ch.funcblock === item.funcblock &&
                            ch.connectedto === item.connectedto).length !== 0 : checked.indexOf(item.id) !== -1}
                        inputProps={{ 'aria-labelledby': `checkbox-list-secondary-label-${index}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>

            <Dialog
                open={itemForm}
                onClose={() => setItemForm(false)}
                maxWidth={"md"}
                fullWidth
            >
                <MuiDialogTitle disableTypography style={{margin: 0, padding: 10}}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant={"h6"}>
                                {item.depname}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={() => setItemForm(false)}>
                                <CloseIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </MuiDialogTitle>
                {mass &&
                    <Grid container direction={"column"}>
                        <Grid item>
                            <TableContainer component={Paper}>
                                <Table aria-label="sap_elem_info">
                                    <TableBody>
                                        <TableRow key="funcblock">
                                            <TableCell align="left">Общий функциональный блок</TableCell>
                                            <TableCell align="right">{item.funcblock}</TableCell>
                                        </TableRow>
                                        <TableRow key="lvl">
                                            <TableCell align="left">Общий уровень</TableCell>
                                            <TableCell align="right">{item.lvl}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item>
                            <Card>
                                {item.deps.map((dep, index) =>
                                    <Accordion className={!Boolean(dep.connectedto) ? classes.needmatch : classes.matched} key={index}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                        >
                                            <Typography className={classes.heading}>{dep.bank}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ElemToggled id={dep.id} select_structure={select_structure} handleRefresh={handleRefresh} setMatching={setMatching} setFakeChosen={setFakeChosen}/>
                                        </AccordionDetails>
                                    </Accordion>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                }
                {!mass &&
                <ElemToggled id={item.id} select_structure={select_structure} handleRefresh={handleRefresh} setMatching={setMatching} setFakeChosen={setFakeChosen}/>
                }
            </Dialog>
        </div>
    </div>
})