import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import UserModal from './userModal';
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";

export default function (props) {
    const {initRow} = props;

    const [row, setRow] = React.useState(initRow);

    const [userModal, setUserModal] = React.useState(false);

    return (
        <TableRow>
            <TableCell padding={"default"} align={"center"}>
                {row.title}
            </TableCell>
            <TableCell padding={"default"} align={"center"}>
                {row.description}
            </TableCell>
            <TableCell padding={"default"} align={"center"}>
                {row.type}
            </TableCell>
            <TableCell padding={"default"} align={"center"}>
                <Tooltip title={row.user_obj}>
                    <IconButton onClick={() => setUserModal(true)}>
                        <Avatar/>
                    </IconButton>
                </Tooltip>
            </TableCell>
            <TableCell padding={"default"} align={"center"}>
                {row.time}
            </TableCell>
            <TableCell padding={"default"} align={"center"}>
                <Checkbox
                    checked={row.solved}
                    color={"primary"}
                    onChange={() => {
                        axios.post('error_report/change_solved', {id: row.id}).then(res => {
                            setRow(res.data.row)
                        })
                    }}
                />
            </TableCell>
            {userModal &&
            <UserModal
                user={row.user_obj}
                open={userModal}
                setOpen={setUserModal}
            />}
        </TableRow>
    )
}