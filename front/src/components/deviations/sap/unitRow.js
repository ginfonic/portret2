import React from "react";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import ErrorDialog from '../../match/units_matching/error_dialog';

export default React.memo(function (props) {
    const {unit, index, deviations, setDeviations} = props;

    const [errorForm, setErrorForm] = React.useState(false);

    const setUnitErrors = (errors) => {
        let new_dev = {...deviations};
        new_dev.match_unit_err[index].errors = errors;
        setDeviations(new_dev);
    };

    return (
        <>
            <TableRow key={`${unit.id}`}>
                <TableCell>
                    {unit.name}
                </TableCell>
                <TableCell>
                    {unit.errors.map(item =>
                        <p
                            key={`${item.name}-${unit.id}`}
                        >
                            {item.name}
                            ({item.description})
                        </p>)
                    }
                </TableCell>
                <TableCell>
                    <Button variant={"outlined"} onClick={() => setErrorForm(true)}>
                        Редактор ошибок
                    </Button>
                </TableCell>
            </TableRow>
            {errorForm && <ErrorDialog errorForm={errorForm} setErrorForm={setErrorForm} unitItem={{units: [unit]}} setUnitErrors={setUnitErrors}/>}
        </>
    )
})