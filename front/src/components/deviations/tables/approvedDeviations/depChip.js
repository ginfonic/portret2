import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ElemToggled from "./add/elem_toggled";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import {Link as LinkIcon} from "@material-ui/icons";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({

    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export default React.memo(function (props) {
    const classes = useStyles();

    const {item} = props;

    const [itemForm, setItemForm] = React.useState(false);

    return (
        <div>
            <Chip
                label={item.depname}
                icon={<LinkIcon/>}
                clickable
                onClick={(e) => {
                    e.stopPropagation();
                    setItemForm(true);
                }}
            />
            {itemForm &&
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
                            <IconButton style={{position: "absolute", top: 5, right: 5}}
                                        onClick={() => setItemForm(false)}>
                                <CloseIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </MuiDialogTitle>
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
                <Card style={{height: 1000, overflow: 'auto', margin: 10}}>
                    {item.deps.map(dep =>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                            >
                                <Typography className={classes.heading}>{dep.bank}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ElemToggled id={dep.id} select_structure={dep.type === 'tb' ? 'tb' : 'gosb'}/>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </Card>
            </Dialog>
            }
        </div>
    )
})