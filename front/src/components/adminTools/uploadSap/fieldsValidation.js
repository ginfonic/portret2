import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import FieldErrorCard from './fieldErrorCard'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 15,
        width: '100%'
    },
    card: {
        marginBottom: 15,
        width: "100%"
    }
}));

export default function PreLoadTable(props) {
    const classes = useStyles();

    const {fileId, setActiveStep, setValidationStop, bank, setCompleteStep, completeStep} = props;

    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState([]);
    const [ok, setOk] = React.useState(false);
    const [selected, setSelected] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        if (fileId.length > 0 && bank.length > 0) {
            axios.post('admin/fields_validation', {fileId}).then(res => {
                if (res.data.errors.length === 0) {
                    setLoading(false);
                    setOk(true);
                    setCompleteStep([...completeStep, 1]);
                    setTimeout(() => setActiveStep(2), 2000);
                }
                else {
                    setErrors(res.data.errors);
                    setLoading(false);
                }
                setValidationStop(false);
            }).catch(e => {
                setLoading(false);
            })
        }
    }, [fileId, bank]);

    return (
        <Container maxWidth={"lg"}>
            <div className={classes.root}>
                {ok &&
                <Typography variant="h6">
                    Все поля файла валидные.
                </Typography>
                }
                {loading ?
                    <CircularProgress/> :
                    <div className={classes.root}>
                        {errors.map((item, index) => {
                            return <FieldErrorCard
                                item={item}
                                key={index}
                                selected={selected}
                                setSelected={setSelected}
                                bank={bank}
                            />
                        })}
                    </div>
                }
            </div>
        </Container>
    );
}