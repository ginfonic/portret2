import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import OutPart from './outPart';
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        backgroundColor: 'green',
        color: 'white',
        borderRadius:'5px',
        marginLeft:'5px'
    },
    mainPart: {
        display: 'flex',
        justifyContent:'center',
        width: '100%',
    }
}));

export default function StructureCol(props){
    const classes = useStyles();
    const { depData, num, dep, depName } = props;

    let out1 = depData.filter(i => i.fnblock === 1);
    let out2 = depData.filter(i => i.fnblock === 2);
    let out3 = depData.filter(i => i.fnblock === 3);
    let out4 = depData.filter(i => i.fnblock === 4);
    let out5 = depData.filter(i => i.fnblock === 5);
    return(
        <Grid container direction='column'>
            {out1.length > 0 &&
                <Grid  className={classes.mainPart}>
                    <OutPart 
                        depName={'Блок Розничный блок и Сеть продаж'}
                        data={out1}
                    />
                </Grid>
            }
            {out2.length > 0 &&
                <Grid  className={classes.mainPart}>
                    <OutPart
                        depName={'Блок Корпоративно-инвестиционный бизнеc'}
                        data={out2}
                    />
                </Grid>
            }
            {out3.length > 0 &&
                <Grid  className={classes.mainPart}>
                    <OutPart
                        depName={'Блок Работа с ПА и правовые вопросы'}
                        data={out3}
                    />
                </Grid>
            }
            {out4.length > 0 &&
                <Grid  className={classes.mainPart}>
                    <OutPart
                        depName={'Региональный сервисный центр'}
                        data={out4}
                    />
                </Grid>
            }
            {out5.length > 0 &&
                <Grid  className={classes.mainPart}>
                    <OutPart
                        depName={'Подразделения прямого подчинения управляющему'}
                        data={out5}
                    />
                </Grid>
            }
        </Grid>
    )
}