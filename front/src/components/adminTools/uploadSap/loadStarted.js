import React from 'react';
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 15,
    },
}));

export default function LoadStarted(props){
    const {setOpen} = props;

    const classes = useStyles();

    const [timeLeft, setTimeLeft] = React.useState(3);

    React.useEffect(() => {
        setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        if (timeLeft === 0) {
            setTimeout(() => setOpen(false), 1000);
        }
    }, [timeLeft]);

    return(
        <Container maxWidth={"sm"} className={classes.root}>
            <Typography variant="h6">
                Загрузка началась
            </Typography>
            <Typography variant="h6">
                Это окно автоматически закроется через {timeLeft}
            </Typography>
        </Container>
    )
}