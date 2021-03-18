import React from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Axios from "axios";

export default React.memo(function (props) {
    const {trash, setTrash} = props;
    const [elems, setElems] = React.useState([]);

    React.useEffect(() => {
        Axios.post('admin/log_trash', {log_id: trash}).then((response) => {
            setElems(response.data.elems);
        });
    }, [trash]);

    return <Dialog
        open={Boolean(trash)}
        onClose={() => setTrash(null)}
        maxWidth={"xl"}
    >
        <DialogTitle>

        </DialogTitle>
        <DialogContent>
            <TableContainer component={Paper} style={{width: '100%'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                До
                            </TableCell>
                            <TableCell>
                                После
                            </TableCell>
                            <TableCell>
                                Schema.Table
                            </TableCell>
                            <TableCell>
                                Тип операции
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {elems.map((elem, index) => <TableRow key={`${index}`}>
                            <TableCell style={{whiteSpace: 'pre-wrap'}}>
                                {elem.before}
                            </TableCell>
                            <TableCell style={{whiteSpace: 'pre-wrap'}}>
                                {elem.after}
                            </TableCell>
                            <TableCell>
                                {elem.schema_table}
                            </TableCell>
                            <TableCell>
                                {elem.operation_tag === 0 ? 'Удаление' : elem.operation_tag === 1 ? 'Добавление' : 'Изменение'}
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
    </Dialog>
})