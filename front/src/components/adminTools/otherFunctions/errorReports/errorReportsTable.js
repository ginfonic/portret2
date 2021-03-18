import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableItem from "./tableItem";
import TableContainer from "@material-ui/core/TableContainer";
import React from "react";
import Axios from "axios";

export default function (props) {
    const [table, setTable] = React.useState([]);

    React.useEffect(() => {
        Axios.get('error_report/table').then((response) => {
            setTable(response.data.table);
        });
    }, []);

    return (
        <TableContainer>
            <Table size={"small"} stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell padding={"default"} align={"center"}>
                            Название ошибки
                        </TableCell>
                        <TableCell padding={"default"} align={"center"}>
                            Описание ошибки
                        </TableCell>
                        <TableCell padding={"default"} align={"center"}>
                            Тип ошибки
                        </TableCell>
                        <TableCell padding={"default"} align={"center"}>
                            Пользователь
                        </TableCell>
                        <TableCell padding={"default"} align={"center"}>
                            Время ошибки
                        </TableCell>
                        <TableCell padding={"default"} align={"center"}>
                            Исправлено
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {table.map((row, index) => <TableItem initRow={row} key={index}/>)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}