import React, {useState} from 'react';
import {Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import UpdateOrderModal from './updateOrderModal';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
    root: {
      borderBottom:'1px solid gray',
      flexDirection:'column'
    },
    menuBtn: {
      alignSelf: 'flex-end'
  },
  }));

  export default function Order(props){
      const {
        name,
        text,
        date,
        num,
        id,
      } = props.data;
      const {redact, depId, getAllData} = props;
      const classes = useStyles();
      const createMarkup = (text) => {
        return { __html: text };
      }
      const [updateModal, setUpdateModal] = useState(false)
      const orderDel = (id) => {
        axios.post('orders/del', {id})
        .then(res => getAllData(depId))
        .catch(err => console.log(err))
      }
      return(
          <Grid container className={classes.root}>
              <Grid item>
                <b>Номер:</b> {num}
              </Grid>
              <Grid item>
                <b>Название:</b> {name}
              </Grid>
              <Grid item>
                <b>Дата:</b> {date}
              </Grid>
              <Grid item>
                <b>Описание:</b>
                <div item dangerouslySetInnerHTML={createMarkup(text)}/>
              </Grid>
              {redact &&
                <>
                  <Grid item className={classes.menuBtn}>
                  <Button startIcon={<CreateIcon />} onClick={()=>setUpdateModal(true)}>Редактировать</Button>
                  <Button startIcon={<DeleteIcon />} onClick={()=>orderDel(id)}>Удалить</Button>
                  </Grid>
                </>
              }
              {updateModal && 
                <UpdateOrderModal 
                  name={name}
                  id={id}
                  text={text}
                  date={date}
                  num={num}
                  depId={depId}
                  getAllData={getAllData}
                  setUpdateModal={setUpdateModal}
                />}
          </Grid>
      )
  }