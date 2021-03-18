import React from 'react';
import {useSelector} from 'react-redux';
import { Row, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';
import TrashIcon from '@material-ui/icons/DeleteOutline';
import style from './style.module.css';

export default function FilesPart(props) {
    const {
        data,
        downloadFile,
        deleteFile,
        typeId
    } = props;
    const user = useSelector(state => state.mainReducer.user);
    const gosbShow = new Set(['43efd630-2b88-431e-8ef9-a011608a68d1', '8c80da06-285f-4f69-abaa-c424ad25dd0d']);
    const koNameShow = new Set(['43efd630-2b88-431e-8ef9-a011608a68d1']);
    const fioShow = new Set(['f803d29d-505c-48c7-9965-0110e752abdb', '8c80da06-285f-4f69-abaa-c424ad25dd0d']);
    const dateShow = new Set(['6f132391-a3e9-4345-b65b-989205cb12a9']);
    const commentShow = new Set(['6f132391-a3e9-4345-b65b-989205cb12a9']);
    const buttonShow = new Set([17,14,1,2,3,4,5,6,7,8]);

    return (
        <>
            <Row>
                <Col className={style.fileDown} style={{color:'blue'}} onClick={() => downloadFile(data.id, data.filename)}>
                    {data.filename} (скачать)
                </Col>
            </Row>
            <Row>
                {gosbShow.has(typeId) &&
                        <Col xs='12'>
                            <span className={style.name}>ГОСБ:</span> {data.gosb}
                        </Col>
                }
                {koNameShow.has(typeId) &&
                    <Col xs='12'>
                        <span className={style.name}> Название КО:</span> {data.ko_name}
                    </Col>
                }
                {fioShow.has(typeId) &&
                    <Col xs='12'>
                        <span className={style.name}>Руководитель:</span> {data.fio}
                    </Col>
                }
                {dateShow.has(typeId) &&
                    <>
                        <Col xs='12'>
                            <span className={style.name}>Дата начала приказа:</span> {data.begin.substring(0, 10)}
                        </Col>
                        <Col xs='12'>
                            <span className={style.name}>Дата окончания приказа:</span> {data.done.substring(0, 10)}
                        </Col>
                    </>
                }
                {commentShow.has(typeId) &&
                    <Col xs='12'>
                        <span className={style.name}>Комментарий:</span> {data.description}
                    </Col>
                }
                <Col xs='12'>
                    <span className={style.name}>Дата добавления:</span> {data.create_date}
                </Col>
                <Col xs='12'>
                    <span className={style.name}>Разместил:</span> {data.username}
                </Col>
            </Row>
            <Row style={{marginTop:'10px', marginBottom:'5px'}}>
                <Col>
                    {buttonShow.has(user.role.id) &&
                        <Button
                            startIcon={<TrashIcon/>}
                            color='primary'
                            onClick={() => deleteFile(data.id)}
                        >
                            Удалить
                        </Button>
                    }
                </Col>
            </Row>
        </>
    )
}
