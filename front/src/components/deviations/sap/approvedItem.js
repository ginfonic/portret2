import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import {CheckCircleOutline, ExpandLess, ExpandMore, Link as LinkIcon, RadioButtonUnchecked} from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse/Collapse";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import DepChip from "../tables/approvedDeviations/depChip";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import {Link} from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    table: {
        width: '100%'
    }
}));

export default React.memo(function (props) {
    const classes = useStyles();

    const {row} = props;

    const [openTable, setOpenTable] = React.useState(false);

    return (
        <div>
            <ListItem
                divider
                button
                onClick={() => {
                    setOpenTable(!openTable);
                }}
            >
                <ListItemIcon>
                    <Tooltip
                        title={
                            row.agreement_done ?
                                row.refused_or_approved ?
                                    'Согласовано' :
                                    'Отказ' :
                                'Согласование не проведено'
                        }
                    >
                        {row.agreement_done ? <CheckCircleOutline/> : <RadioButtonUnchecked/>}
                    </Tooltip>
                </ListItemIcon>
                <ListItemText>
                    {row.text}
                </ListItemText>
                <ListItemIcon>
                    {openTable ? <ExpandLess/> : <ExpandMore/>}
                </ListItemIcon>
            </ListItem>

            <Collapse in={openTable} timeout={"auto"} unmountOnExit className={classes.nested}>
                <TableContainer className={classes.table}>
                    <Table size={"small"}>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Банк
                                </TableCell>
                                <TableCell>
                                    Подразделение
                                </TableCell>
                                <TableCell>
                                    Номер запроса
                                </TableCell>
                                <TableCell>
                                    Дата запроса
                                </TableCell>
                                <TableCell>
                                    Номер ответа
                                </TableCell>
                                <TableCell>
                                    Дата отправки ответа в ТБ
                                </TableCell>
                                <TableCell>
                                    Ответственный
                                </TableCell>
                                <TableCell>
                                    Рассмотренно
                                </TableCell>
                                <TableCell>
                                    Статус согласования
                                </TableCell>
                                <TableCell>
                                    Комментарий к согласованию
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <div>
                                    {
                                        row.banks.map(bank => (
                                            <Link
                                                onClick={(e) => e.stopPropagation()}
                                                to={bank.link_to}
                                                target="_blank"
                                                key={bank.name}
                                            >
                                                <Chip
                                                    key={bank.name}
                                                    label={bank.name}
                                                    icon={<LinkIcon/>}
                                                    clickable
                                                />
                                            </Link>)
                                        )
                                    }
                                </div>
                                <TableCell>
                                    <div>
                                        {
                                            row.deps.map((item, index) => {
                                                return <DepChip item={item} key={index}/>
                                            })
                                        }
                                    </div>
                                </TableCell>
                                <TableCell>{row.req_num}</TableCell>
                                <TableCell>{row.req_date}</TableCell>
                                <TableCell>{row.answer_num}</TableCell>
                                <TableCell>{row.answer_send_date}</TableCell>
                                <TableCell>{row.in_charge_of}</TableCell>
                                <TableCell>{row.agreement_done ? <CheckCircleOutline/> :
                                    <RadioButtonUnchecked/>}</TableCell>
                                <TableCell>{row.agreement_done ? row.refused_or_approved ? 'Согласовано' : 'Отказ' : '-'}</TableCell>
                                <TableCell>{row.agreement_done ? row.final_decision_comments.length > 0 ? row.final_decision_comments : '-' : '-'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </div>
    )
})