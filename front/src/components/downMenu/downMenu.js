import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Tooltip } from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import { SetCount } from '../../redux/actions';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import FactCountIcon from '@material-ui/icons/SupervisedUserCircle';
import VacancyIcon from '@material-ui/icons/Warning';
import LampIcon from '@material-ui/icons/EmojiObjects';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import CalendarIcon from '@material-ui/icons/DateRange';
import SearchIcon from '@material-ui/icons/Search';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DateIcon from './dateIcon';

const useStyles = makeStyles((theme) => ({
    root: {
        color: 'green',
        marginTop:'20px',
        maxHeight:'40px'
    },
    depname: {
        textAlign: 'center',
        color: 'green',
        fontSize: '1.5em'
    },
    iconPart: {
        display: 'flex',
        justifyContent:'space-around',
    },
    icons: {
        cursor:'pointer'
    }
}));

export default function DownMenu(props){

    const classes = useStyles();
    const {
        depName
    } = props;

    const count = useSelector(state => state.mainReducer.count);
    const dispatch = useDispatch();
    const countChange = (value) => {
        dispatch(SetCount(value))
    }

    const convert = () => {
        setTimeout(() => {
            const input = document.getElementById('screenShot');
            html2canvas(input)
            .then((canvas) => {
                const width = canvas.width;
                const height = canvas.height;
                const millimeters = {};
                millimeters.width = Math.floor(width*0.264583);
                millimeters.height = Math.floor(height *0.264583);
                console.log('millime------------->>',millimeters)
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4');
                pdf.deletePage(1);
                pdf.addPage(`${millimeters.width}`, `${millimeters.height}`);
                pdf.addImage(imgData, 'PNG',0,0);
                pdf.save(`PDF.pdf`);
            })
        }, 1000);
    };

    return(
        <Grid container className={classes.root}>
            <Grid item xs={4} className={classes.iconPart}>
                <Tooltip title="Штатная численность">
                    <MenuBookIcon
                        fontSize='large'
                        className={classes.icons}
                        style={{color: count === 'state' ? 'teal' : null}}
                        onClick={()=> countChange('state')}
                    />
                </Tooltip>
                <Tooltip title="Фактическая численность">
                    <FactCountIcon
                        fontSize='large'
                        className={classes.icons}
                        style={{color: count === 'fact' ? 'teal' : null}}
                        onClick={()=> countChange('fact')}
                    />
                </Tooltip>
                <Tooltip title="Вакансии">
                    <VacancyIcon
                        fontSize='large'
                        className={classes.icons}
                        style={{color: count === 'vacancy' ? 'teal' : null}}
                        onClick={()=> countChange('vacancy')}
                    />
                </Tooltip>
            </Grid>
            <Grid item xs={4} className={classes.depname}>
                {depName}
            </Grid>
            <Grid item xs={4} className={classes.iconPart}>
                {/* <LampIcon fontSize='large' className={classes.icons}/> */}
                {/* <SearchIcon fontSize='large' className={classes.icons}/> */}
                <PdfIcon fontSize='large' className={classes.icons} onClick={convert}/>
                <DateIcon/>
                {/* <CalendarIcon fontSize='large' className={classes.icons}/> */}
            </Grid>
        </Grid>
    )
}