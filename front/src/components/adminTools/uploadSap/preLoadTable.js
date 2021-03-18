import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import PreLoadListElem from "./preLoadListElem";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 15,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    card: {
        height: 1000,
        overflow: 'auto'
    },
    divmargin: {
        marginBottom: 15,
    }
}));

export default function PreLoadTable(props) {
    const classes = useStyles();

    const {cutDeps, helpers, bank, preLoad, fileId} = props;

    const [obj, setObj] = React.useState(0);
    const [vspKic, setVspKic] = React.useState(0);

    const preLoadLists = (obj, type) => {
        let return_array = [];

        let index = 0;
        while (index + obj.startDeps <= 18) {
            let obj_index = `_${obj.startDeps + index}`;
            if (obj[obj_index].length !== 0) {
                return_array.push(
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                        >
                            <Typography className={classes.heading}>Deps {index + 3} lvl</Typography>
                        </AccordionSummary>
                        <Divider/>
                        <AccordionDetails>
                            <List>
                                {obj[obj_index].map((value, index) =>
                                    <PreLoadListElem
                                        key={`${index}-${value}`}
                                        cutDeps={cutDeps}
                                        helpers={helpers}
                                        obj_index={obj_index}
                                        bank={bank}
                                        value={value}
                                        type={type}
                                    />)}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                );
            }
            index += 1;
        }
        return return_array
    };

    return (
        <Container maxWidth={"xl"} className={classes.root}>
            {!(preLoad !== null && fileId !== '' && cutDeps !== null && helpers !== null) ?
                <CircularProgress/> :
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Paper elevation={2}>
                        <Tabs
                            value={obj}
                            onChange={(event, newValue) => {
                                setObj(newValue)
                            }}
                            variant={"fullWidth"}
                        >
                            <Tab label={"tb"} disabled={preLoad.tb === null}/>
                            <Tab label={"gosb"} disabled={preLoad.gosb === null}/>
                            <Tab label={"head"} disabled={preLoad.head === null}/>
                        </Tabs>
                        <Card style={{overflow: 'auto', height: 670}}>
                            {obj === 0 && preLoad.tb !== null &&
                            preLoadLists(preLoad.tb, 'tb')
                            }
                            {obj === 1 && preLoad.gosb !== null &&
                            preLoadLists(preLoad.gosb, 'gosb')
                            }
                            {obj === 2 && preLoad.head !== null &&
                            preLoadLists(preLoad.head, 'head')
                            }
                            <div className={classes.divmargin}/>
                        </Card>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={2}>
                        <Tabs
                            value={vspKic}
                            onChange={(event, newValue) => {
                                setVspKic(newValue)
                            }}
                            variant={"fullWidth"}
                        >
                            <Tab label={"kic_tb"} disabled={preLoad.kic_tb === null}/>
                            <Tab label={"kic_gosb"} disabled={preLoad.kic_gosb === null}/>
                            <Tab label={"vsp_gosb"} disabled={preLoad.kic_gosb === null}/>
                            <Tab label={"vsp_head"} disabled={preLoad.kic_gosb === null}/>
                            {bank === 'Московский банк' &&
                            <Tab label={"vsp_msk"}/>
                            }
                        </Tabs>
                        <Card style={{overflow: 'auto', height: 670}}>
                            {vspKic === 0 && preLoad.kic_tb !== null &&
                            preLoadLists(preLoad.kic_tb, 'kic_tb')
                            }
                            {vspKic === 1 && preLoad.kic_gosb !== null &&
                            preLoadLists(preLoad.kic_gosb, 'kic_gosb')
                            }
                            {vspKic === 2 && preLoad.vsp_gosb !== null &&
                            preLoadLists(preLoad.vsp_gosb, 'vsp_gosb')
                            }
                            {vspKic === 3 && preLoad.vsp_head !== null &&
                            preLoadLists(preLoad.vsp_head, 'vsp_head')
                            }
                            {vspKic === 4 && bank === 'Московский банк' &&
                            preLoadLists(preLoad.vsp_msk, 'vsp_msk')
                            }
                            <div className={classes.divmargin}/>
                        </Card>
                    </Paper>
                </Grid>
            </Grid>
            }
        </Container>
    );
}