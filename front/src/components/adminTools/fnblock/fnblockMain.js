import React, {useState, useEffect} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Card from "@material-ui/core/Card/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {BlockPart} from './blockPart';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        marginTop: 15,
        maxHeight: '550px',
        '&:hover':{
            transition: '10s ease-out',
            overflowY:'auto',
        }
    },
    button: {
        marginLeft: 15,
        marginBottom: 15,
    }
}));

export const FnblockMain = () => {

    const classes = useStyles();
    const [blockData, setBlockData] = useState([]);
    const block = [
        {id:0, title:'Нет принадлежности'},
        {id:1, title:'Блок Розничный блок и Сеть продаж'},
        {id:2, title:'Блок Корпоративно-инвестиционный бизнеc'},
        {id:3, title:'Блок Работа с ПА и правовые вопросы'},
        {id:4, title:'Региональный сервисный центр'},
        {id:5, title:'Подразделения прямого подчинения управляющему'},
        {id:6, title:'HR'},

    ];

    useEffect(() => {
        axios.post('fnblock', {})
        .then(res => setBlockData(res.data))
    }, [])

    const changeBlock = (block, id) => {
        axios.post('fnblock/change', {block, id})
        .then(res => setBlockData(res.data))
    }

    return(
        <Card className={classes.root}>
             <CardHeader
                title="Управление блоками"
            />
            {block.map(i =>
                <BlockPart
                  block={i}
                  key={i.id}
                  blockData={blockData}
                  allBlock={block}
                  id={i.id}
                  changeBlock={changeBlock}/>
                  
            )}

        </Card>
    )
}