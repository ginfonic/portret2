import React from "react";
import Axios from "axios";
import List from "@material-ui/core/List";
import DepItem from './depItem';
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Filters from './depSelectorFilters';
import {VariableSizeList} from "react-window";

export default React.memo(function (props) {
    const {selected, setSelected} = props;

    const [deps, setDeps] = React.useState([]);
    const [filter, setFilter] = React.useState({depname: '', lvl: '', funcblock: '', bank: ''});

    React.useEffect(() => {
        Axios.post('deviation_approved/deps', {banks: selected.banks, filter}).then(res => {
            setDeps(res.data.deps);
        })
    }, [selected.banks, filter]);

    const depRow = ({index, style}) => {
        return <div style={style} key={index}>
            <DepItem item={deps[index]} key={index} selected={selected} setSelected={setSelected}/>
        </div>
    };

    const rowheight = index => {
        return 48
    };

    return (
        <Grid container>
            <Grid item xs={8}>
                <Card style={{margin: 5}}>
                    <List>
                        <VariableSizeList
                            height={940}
                            itemCount={deps.length}
                            width={'100%'}
                            itemSize={rowheight}>
                            {depRow}
                        </VariableSizeList>
                    </List>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card style={{margin: 5}}>
                    <Filters filter={filter} setFilter={setFilter} banks={selected.banks}/>
                </Card>
            </Grid>
        </Grid>
    );
})