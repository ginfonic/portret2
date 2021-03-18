import React, {useState, useEffect} from 'react';
import {Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {useSelector} from 'react-redux';
import DepSelector from './depSelector';
import StructureCol from './structureCol';
import DepPart from './depPart';
import {StructureContext} from './structureContext';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

const useStyles = makeStyles({
    autocomplite: {
        marginTop: '10px',
    },
    depname: {
        justifyContent: 'center',
        textAlign: 'center',
        display:'flex',
        minHeight:'40px',
        alignItems:'center',
        fontSize:'1.5em',
        color: 'green'
    },
    colPart: {
        justifyContent:'space-around'
    },
    choose:{
        color: 'green',
        fontSize:'1.5em'
    },
    icon:{
        cursor:'pointer',
        color:"green",
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }
  });

export const StructureMain = (props) => {
    const classes = useStyles();
    const [selected, setSelected] = useState({name:'', type: ''});
    const [data, setData] = useState(null)
    const date = useSelector(state => state.mainReducer.date);
    const convert = () => {
            const input = document.getElementById('screenShot');
            html2canvas(input)
            .then((canvas) => {
                const width = canvas.width;
                const height = canvas.height;
                const millimeters = {};
                millimeters.width = Math.floor(width*0.264583);
                millimeters.height = Math.floor(height *0.264583);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4');
                pdf.deletePage(1);
                pdf.addPage(`${millimeters.width}`, `${millimeters.height}`);
                pdf.addImage(imgData, 'PNG',0,0);
                pdf.save(`PDF.pdf`);
            })
    };
    const getAllHeandler = () => {
        axios.post('structure/data', {dep:selected.name, type:selected.type, date:date})
            .then(res => {
                if(res.data[1] === null){
                    setData(null)
                }else{
                    setData(res.data)
                }
            })
    }
    useEffect(() => {
        setData(null)
        if(selected.name != ''){
            getAllHeandler()
        }
    }, [selected.name])

    return(
        <div id='screenShot'>
        <Grid container>
            <Grid item className={classes.autocomplite} xs={4}>
                <DepSelector setSelected={setSelected}/>
            </Grid>
            <Grid item className={classes.depname} xs={4}>
                <span>{selected.name}</span>
            </Grid>
            {data &&
                <Grid item xs={4} className={classes.icon}>
                    <PdfIcon fontSize='large' onClick={convert}/>
                </Grid>
            }
        </Grid>
        {data &&
            <StructureContext.Provider value={{allDeps: data.all, assistans: data.assistant, update: getAllHeandler}}>
            <Grid container justify="center">
                <Grid item xs={2}>
                <DepPart
                    depname={data.upr.depname}
                    id={data.upr.id}
                    lvl={data.upr.lvl}
                    key={data.upr.id}
                />
                </Grid>
            </Grid>
            <Grid container className={classes.colPart}>
                <StructureCol
                    colName="Блок Розничный блок и Сеть продаж"
                    colNum={1}
                    colData={data[1]}
                />
                <StructureCol
                    colName="Блок Корпоративно-инвестиционный бизнеc"
                    colNum={2}
                    colData={data[2]}
                />
                <StructureCol
                    colName="Блок Работа с ПА и правовые вопросы"
                    colNum={3}
                    colData={data[3]}
                />
                <StructureCol
                    colName="Региональный сервисный центр"
                    colNum={4}
                    colData={data[4]}
                />
                {selected.type === 'tb' && data[6] &&
                    <StructureCol
                        colName="HR"
                        colNum={6}
                        colData={data[6]}
                    />
                }
                <StructureCol
                    colName="Подразделения прямого подчинения управляющему"
                    colNum={5}
                    colData={data[5]}
                />
            </Grid>
            </StructureContext.Provider>
        }
        </div>
    )
}