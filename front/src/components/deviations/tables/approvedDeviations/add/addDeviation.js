import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import BankSelector from './bankSelector';
import DepSelector from './depSelector';
import InfoSelector from './infoSelector';
import Axios from "axios";

function getSteps() {
    return [
        'Выбор банка',
        'Выбор подразделений',
        'Инофрмация о отклонении'
    ]
}

export default React.memo(function AddDeviation(props) {
    const {add, setAdd, filter, setRows, redact, setRedact} = props;

    const [selected, setSelected] = React.useState({
        banks: [],
        deps: [],
        req_num: '',
        text: '',
        answer_num: '',
        in_charge_of: '',
        agreement_done: false,
        refused_or_approved: true,
        final_decision_comments: '',
        req_date: new Date(),
        answer_send_date: new Date(),
    });
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    React.useEffect(() => {
        if (redact !== null) {
            Axios.post('deviation_approved/deviation_to_redact', {redact}).then(res => {
                res.data.selected.req_date = new Date(res.data.selected.req_date);
                res.data.selected.answer_send_date = new Date(res.data.selected.answer_send_date);
                setSelected(res.data.selected);
            });
        }
    }, []);

    const save = () => {
        selected.req_date = selected.req_date.toDateString();
        selected.answer_send_date = selected.answer_send_date.toDateString();
        Axios.post('deviation_approved/save', {selected, filter, redact}).then(res => {
            if (res.data.status === 'ok') {
                setRows(res.data.table)
            }
        });
        setAdd(false);
        setRedact(null);
    };

    return <Dialog open={add} maxWidth={"lg"} fullWidth onClose={() => setRedact(null)}>
        <MuiDialogTitle disableTypography style={{margin: 0, padding: 10}}>
            <Typography variant={"h6"}>
                Добавление согласованного отклонения
            </Typography>
            <IconButton style={{position: "absolute", top: 5, right: 5}} onClick={() => {
                setAdd(false);
                setRedact(null);
            }}>
                <CloseIcon/>
            </IconButton>
        </MuiDialogTitle>
        <DialogContent>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const labelProps = {};
                    if (index === 1 && selected.deps.length === 0) {
                        labelProps.optional = <Typography variant={"caption"}>Без подразделений</Typography>
                    }
                    return (
                        <Step key={label}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <div style={{maxHeight: 1000, overflow: "auto"}}>
                {activeStep === 0 && <BankSelector selected={selected} setSelected={setSelected}/>}
                {activeStep === 1 && <DepSelector selected={selected} setSelected={setSelected}/>}
                {activeStep === 2 && <InfoSelector selected={selected} setSelected={setSelected}/>}
            </div>
        </DialogContent>
        <DialogActions>
            {activeStep !== steps.length && activeStep !== 0 &&
                <Button variant="contained" onClick={() => setActiveStep(activeStep - 1)}>
                    Назад
                </Button>
            }
            {activeStep === steps.length - 1 ?
                <Button variant="contained" onClick={() => {
                    save();
                    setAdd(false);
                }}>
                    Сохранить
                </Button>
                :
                <Button
                    variant="contained"
                    disabled={activeStep === 0 && selected.banks.length === 0}
                    onClick={() => setActiveStep(activeStep + 1)}
                >
                    Далее
                </Button>
            }
        </DialogActions>
        </Dialog>
});