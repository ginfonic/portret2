import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Upload from './upload_file';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import PreLoadTable from './preLoadTable';
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import DialogActions from "@material-ui/core/DialogActions";
import axios from "axios";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Container from "@material-ui/core/Container";
import LoadStarted from './loadStarted';
import FieldValidation from './fieldsValidation';
import {Error} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        marginTop: 15,
    },
    dev_grow: {
        flexGrow: 1,
    },
    dev_appBar: {
        position: "relative",
        backgroundColor: green[600],
        zIndex: theme.zIndex.drawer + 1,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
}));

export default function MainUploadSap(props) {
    const classes = useStyles();

    const {open, setOpen, update, setUpdate} = props;
    const [preLoad, setPreLoad] = React.useState(null);
    const [cutDeps, setCutDeps] = React.useState(null);
    const [helpers, setHelpers] = React.useState(null);
    const [fileId, setFileId] = React.useState('');
    const [bank, setBank] = React.useState('');
    const [activeStep, setActiveStep] = React.useState(0);
    const [validationStop, setValidationStop] = React.useState(true);
    const [completeStep, setCompleteStep] = React.useState([]);

    const steps = ['Загрузка файла', 'Валидация полей', 'Выбор подразделений', 'Готово'];

    React.useEffect(() => {
        if (fileId.length > 0 && (activeStep === 2)) {
            axios.post('admin/preload_sap', {fileId}).then((res) => {
                setPreLoad(res.data.preLoad);
                setBank(res.data.bank);
            })
        }
    }, [fileId, activeStep]);

    React.useEffect(() => {
        if (preLoad !== null && (activeStep === 2) && bank.length !== 0) {
            axios.post('admin/pre_load_cutdeps',
                {preLoad, bank}).then((res) => {
                setCutDeps(res.data.cutDeps)
            })
        }
    }, [preLoad, activeStep, bank]);

    React.useEffect(() => {
        if (preLoad !== null && (activeStep === 2)) {
            axios.post('admin/pre_load_helpers', {preLoad, fileId}).then((res) => {
                setHelpers(res.data.helpers)
            })
        }
    }, [preLoad, activeStep, bank]);

    return (
        <Dialog open={open}
                onClose={() => {
                    setOpen(false)
                }}
                maxWidth={"xl"}
                fullWidth
        >
            <AppBar className={classes.dev_appBar} color={"transparent"}>
                <Toolbar>
                    <Typography variant="h6">
                        Загрузка данных SAP
                    </Typography>
                    <div className={classes.dev_grow}/>
                    <IconButton autoFocus edge="start" color="inherit" onClick={() => setOpen(false)}>
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <Container maxWidth={"md"}>
                <Stepper activeStep={activeStep} nonLinear>
                    {steps.map((label, index) => {
                        const labelProps = {};
                        if (index === 1 && completeStep.indexOf(1) === -1 && activeStep > 0) {
                            labelProps.icon =
                                <Tooltip
                                    title={
                                        'При пропуске этого шага возможны ошибки в SAP'
                                    }
                                >
                                    <Error/>
                                </Tooltip>
                        }
                        return (
                            <Step key={label} completed={completeStep.indexOf(index) !== -1}>
                                <StepLabel {...labelProps}>
                                    {label}
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                </Container>
                <div>
                    {activeStep === 0 &&
                    <Upload
                        setPreLoad={setPreLoad}
                        setFileId={setFileId}
                        setBank={setBank}
                        setActiveStep={setActiveStep}
                        setCompleteStep={setCompleteStep}
                        completeStep={completeStep}
                    />}
                    {activeStep === 1 &&
                    <FieldValidation
                        fileId={fileId}
                        setActiveStep={setActiveStep}
                        setValidationStop={setValidationStop}
                        bank={bank}
                        setCompleteStep={setCompleteStep}
                        completeStep={completeStep}
                    />}
                    {activeStep === 2 &&
                    <PreLoadTable
                        preLoad={preLoad}
                        cutDeps={cutDeps}
                        helpers={helpers}
                        fileId={fileId}
                        bank={bank}
                    />}
                    {activeStep === 3 && <LoadStarted setOpen={setOpen}/>}
                </div>
            </DialogContent>
            <DialogActions>
                {activeStep === 1 && !validationStop &&
                <Button
                    variant={"outlined"}
                    onClick={() => {
                            setActiveStep(2);
                            setCompleteStep([...completeStep, 1]);
                            setUpdate(!update)
                    }}
                >
                    Далее
                </Button>
                }
                {activeStep === 1 && validationStop &&
                <Tooltip
                    title={
                        'При пропуске этого шага возможны ошибки в SAP'
                    }
                >
                    <Button
                        variant={"outlined"}
                        onClick={() => {
                            setActiveStep(2);
                            setUpdate(!update)
                        }}
                    >
                        Пропустить
                    </Button>
                </Tooltip>
                }
                {activeStep === 2 &&
                <Button
                    variant={"outlined"}
                    onClick={() => {
                        setActiveStep(3);
                        axios.post("admin/upload_sap", {fileId, cutDeps}).then(() => {
                            setCompleteStep([...completeStep, 2, 3]);
                            setUpdate(!update)
                        });
                    }}
                >
                    Загрузить
                </Button>
                }
            </DialogActions>
        </Dialog>
    );
}
