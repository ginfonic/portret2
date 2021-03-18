import React from "react";
import Card from "@material-ui/core/Card/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import {Delete} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import SapUnitItem from './sap_units_item'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 700,
    },

    cardHeader: {
        padding: theme.spacing(1, 2),
    },
}));

export default React.memo(function Units(props) {
        const classes = useStyles();

        const {units, height, selected, setSelected, select_structure} = props;

        const remove_selected = () => {
            setSelected([]);
        };

        const list_items = () => {
            let array = [];
            for (let index in units) {
                if (units.hasOwnProperty(index)) {
                    array.push(
                        <SapUnitItem
                            item={{
                                name: index,
                                units: units[index],
                            }}
                            selected={selected}
                            setSelected={setSelected}
                            select_structure={select_structure}
                            key={index}
                        />)
                }
            }
            return array
        };

        return (
            <div className={classes.root}>
                <Card style={{height: height / 2}}>
                    <CardHeader
                        className={classes.cardHeader}
                        title={`Должности SAP`}
                        subheader={`Всего: ${Object.keys(units).length}`}
                        action={
                            <Tooltip title={"Очистить выбранные"} arrow>
                                <IconButton onClick={remove_selected} color={"secondary"} size={"small"}>
                                    <Delete/>
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <Divider/>
                    <List component="nav" aria-label="main mailbox folders"
                          style={{
                              overflow: 'auto',
                              height: height / 2 - 72
                          }}>
                        {list_items()}
                    </List>
                </Card>
            </div>
        );
    }
)