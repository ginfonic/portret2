import React from "react";
import Axios from "axios";
import List from "@material-ui/core/List";
import BankItem from './bankItem';
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";

export default React.memo(function (props) {
    const {selected, setSelected} = props;

    const [banks, setBanks] = React.useState([]);

    React.useEffect(() => {
        Axios.get('deviation_approved/banks').then(res => {
            setBanks(res.data.banks);
        })
    }, []);
    return (
    <React.Fragment>
        <Container maxWidth={"sm"}>
            <Card style={{margin: 5}}>
                <List>
                    {banks.map(tb => (
                        <BankItem tb={tb} key={tb.name} selected={selected} setSelected={setSelected}/>
                    ))}
                </List>
            </Card>
        </Container>
    </React.Fragment>
    );
})