import React from "react";
import Card from "@material-ui/core/Card/Card";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Divider from "@material-ui/core/Divider";
import CardHeader from "@material-ui/core/CardHeader";
import ListSubheader from "@material-ui/core/ListSubheader";
import SapListElem from "./sap_list/list_elem"
import Axios from "axios";
import Paper from "@material-ui/core/Paper";
import Zoom from "@material-ui/core/Zoom";
import IconButton from "@material-ui/core/IconButton";
import {Close} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },

    cardHeader: {
        padding: theme.spacing(1, 2),
    },
}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default React.memo(function BestMatches(props) {
    const classes = useStyles();

    const {
        height,
        bestMatchesChecked,
        setBestMatchesChecked,
        bestMatches,
        setBestMatches,
        connected,
        chosen_id,
        select_structure,
        setMatching,
        setFakeChosen,
        setAdd,
        mass,
        setMass,
        setSap,
        setSapChecked,
        setConnected
    } = props;

    const [elemsHeight, setElemsHeight] = React.useState(60);

    const numberOfChecked = () => bestMatchesChecked.length;

    let filtered_array = [];
    for (let key in bestMatches) {
        filtered_array.push(...bestMatches[key]);
    }

    React.useEffect(() => {
        let header = document.getElementById('best_matches_header');
        if (header) setElemsHeight(header.offsetHeight);
    });

    React.useEffect(() => {
        Axios.post('match/etalon_best_matches', {select_structure, id: chosen_id, connected, mass})
            .then((response) => setBestMatches(response.data.best_matches));
    }, [connected, setBestMatches, select_structure, mass]);

    const handleCheckAll = (filtered_array) => () => {
        if (numberOfChecked() > 0 && numberOfChecked() < filtered_array.length) {
            setBestMatchesChecked([])
        }
        else if (numberOfChecked() === filtered_array.length) {
            setBestMatchesChecked(not(bestMatchesChecked, filtered_array.map((item, index) => item.id)));
        } else {
            setBestMatchesChecked(union(bestMatchesChecked, filtered_array.map((item, index) => item.id)));
        }
    };

    const best_matches_list = Object.keys(bestMatches).map((key) => <div key={key}>
        <ListSubheader>
            {key}
        </ListSubheader>
        <Divider/>
        {bestMatches[key].map((item, index) =>
            <SapListElem
                key={`bm - ${index}`}
                index={index}
                item={item}
                checked={bestMatchesChecked}
                setChecked={setBestMatchesChecked}
                select_structure={select_structure}
                setMatching={setMatching}
                setFakeChosen={setFakeChosen}
                mass={mass}
            />)}
    </div>);

    return (
        <div className={classes.root}>
            <Paper elevation={6}>
                <Card>
                    <CardHeader
                        id="best_matches_header"
                        className={classes.cardHeader}
                        avatar={
                            <div>
                                <FormControlLabel
                                    label='Массовый метчинг'
                                    control={<Checkbox color={"default"}/>}
                                    onChange={()=> {
                                        setBestMatchesChecked([]);
                                        setSapChecked([]);
                                        setSap([]);
                                        setConnected([]);
                                        setBestMatches([]);
                                        setMass(!mass);
                                    }}
                                    checked={mass}
                                />
                                <Checkbox
                                    onClick={handleCheckAll(filtered_array)}
                                    checked={numberOfChecked(filtered_array) === filtered_array.length && filtered_array.length !== 0}
                                    indeterminate={numberOfChecked(filtered_array) !== filtered_array.length && numberOfChecked(filtered_array) !== 0}
                                    disabled={filtered_array.length === 0}
                                    inputProps={{ 'aria-label': 'all items selected' }}
                                />
                            </div>
                        }
                        title="Лучшие совпадения"
                        subheader={`${numberOfChecked(filtered_array)}/${filtered_array.length} selected`}
                        action={
                            <Tooltip
                                title='Закрыть списки для метчинга'
                                arrow
                                TransitionComponent={Zoom}
                            >
                                <IconButton onClick={() => setAdd(false)}>
                                    <Close/>
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <Divider/>
                    <List component="nav" aria-label="main mailbox folders" style={{
                        overflow: 'auto',
                        height: height - elemsHeight - 32
                    }}>
                        {best_matches_list}
                    </List>
                </Card>
            </Paper>
        </div>
    );
})