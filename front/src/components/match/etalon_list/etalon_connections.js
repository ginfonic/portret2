import React from "react";
import Card from "@material-ui/core/Card/Card";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Divider from "@material-ui/core/Divider";
import CardHeader from "@material-ui/core/CardHeader";
import SapListElem from "../sap_list/list_elem"
import {green} from "@material-ui/core/colors"

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },

    cardHeader: {
        padding: theme.spacing(1, 2),
    },

    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[600],
        marginTop: 12,
        '&:hover': {
            backgroundColor: green[300],
        }
    }
}));

export default React.memo(function EtalonConnections(props) {
    const classes = useStyles();

    const {connected, checked, setChecked, add, seeSap, mass,
        height, select_structure, setMatching, setFakeChosen, connectedCount} = props;

    const array = connected;

    const numberOfChecked = () => checked.length;

    const handleCheckAll = (array) => () => {
        if (numberOfChecked() > 0 && numberOfChecked() <= array.length) {
            setChecked([])
        } else {
            setChecked(array);
        }
    };

    let list_items = array.map((item, index) => <SapListElem
            item={item}
            checked={checked}
            setChecked={setChecked}
            select_structure={select_structure}
            key={`connections-${index}`}
            setMatching={setMatching}
            setFakeChosen={setFakeChosen}
            mass={mass}
        />
    );

    return (
        <div className={classes.root}>
                <Card style={{maxHeight: height / 2 }}>
                    <CardHeader
                        className={classes.cardHeader}
                        avatar={ !(add || seeSap) ? null :
                            <Checkbox
                                onClick={handleCheckAll(array)}
                                checked={numberOfChecked(array) === array.length && array.length !== 0}
                                indeterminate={numberOfChecked(array) !== array.length && numberOfChecked(array) !== 0}
                                disabled={array.length === 0}
                                inputProps={{ 'aria-label': 'all items selected' }}
                            />
                        }
                        title="Привязанные SAP"
                        subheader={!add ? `Всего: ${array.length} (${connectedCount})` : `${numberOfChecked(array)}/${array.length} (${connectedCount}) selected`}
                    />
                    <Divider/>
                    <List component="nav" aria-label="main mailbox folders"
                          style={{
                              overflow: 'auto',
                              height: height - (height / 2 - 60) - 72 - (add ? 66 : 80)
                          }}>
                        {list_items}
                    </List>
                </Card>
        </div>
    );
}
)