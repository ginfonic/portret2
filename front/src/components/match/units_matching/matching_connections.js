import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import ListElem from "./list_elem";
import Card from "@material-ui/core/Card/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },

    cardHeader: {
        padding: theme.spacing(1, 2),
    },
}));


export default React.memo(function MatchingConnections(props) {
        const classes = useStyles();

        const {connected, height, select_structure, value, checked, setChecked} = props;

        React.useEffect(() => {
            setChecked(value === 'mass' ? [...connected.map((item) => item.id)]: [])
        }, [value, connected]);


        let list_items = connected.map((item, index) => <ListElem
            item={item}
            checked={checked}
            setChecked={setChecked}
            select_structure={select_structure}
            value={value}
            key={index}
            />
        );

        return (
            <div className={classes.root}>
                <Card style={{maxHeight: height / 1.4 }}>
                    <CardHeader
                        className={classes.cardHeader}
                        title="Привязанные SAP"
                        subheader={`Всего: ${connected.length}`}
                    />
                    <Divider/>
                    <List component="nav" aria-label="main mailbox folders"
                          style={{
                              overflow: 'auto',
                              height: height / 1.4 - 72
                          }}>
                        {list_items}
                    </List>
                </Card>
            </div>
        );
    }
)