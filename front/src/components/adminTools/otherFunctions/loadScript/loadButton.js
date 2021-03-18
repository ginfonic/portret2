import React from "react";
import {GetApp} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import Axios from "axios";
import * as XLSX from "xlsx";

export default React.memo((props) => {
    const {link, name} = props;

    const downloadXLSX = (num) => {
        Axios.get(link).then((response) => {
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';

            console.log(response.data.table);
            let table = response.data.table;
            const ws = XLSX.utils.json_to_sheet(table);
            const wb = {Sheets: {'data': ws}, SheetNames: ['data']};
            const excelBuffer = XLSX.write(wb, {bookType: "xlsx", type: "array"});
            const data = new Blob([excelBuffer], {type: fileType});
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}` + fileExtension);
            document.body.appendChild(link);
            link.click();
        })
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() => downloadXLSX(1)}
            startIcon={<GetApp/>}
        >
            {name}
        </Button>
    )
})