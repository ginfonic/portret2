import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StructureCol from './structureCol';
import OutstateCol from './outstateCol';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        minHeight: '40px',
    },
}));


export default function Structure(props){
    const classes = useStyles();
    const { 
        depData,
        dep,
        depName 
    } = props;
    const user = useSelector(state => state.mainReducer.user);
    return(
        <Grid container spacing={3} >
                <Grid item xs={2}>
                    <Grid className={classes.paper}>Блок Розничный блок и Сеть продаж</Grid>
                    <StructureCol
                        depData={depData}
                        num={1}
                        dep={dep}
                        depName={depName}
                    />
                </Grid>

                <Grid item xs={2}>
                    <Grid className={classes.paper}>Блок Корпоративно-инвестиционный бизнеc</Grid>
                    <StructureCol
                        depData={depData}
                        num={2}
                        dep={dep}
                        depName={depName}
                    />
                </Grid>

                <Grid item xs={2}>
                    <Grid className={classes.paper}>Блок Работа с ПА и правовые вопросы</Grid>
                    <StructureCol
                        depData={depData}
                        num={3}
                        dep={dep}
                        depName={depName}
                    />
                </Grid>

                <Grid item xs={2}>
                    <Grid className={classes.paper}>Региональный сервисный центр</Grid>
                    <StructureCol
                        depData={depData}
                        num={4}
                        dep={dep}
                        depName={depName}
                    />
                </Grid>

                {!dep &&
                    <Grid item xs={2}>
                    <Grid className={classes.paper}>HR</Grid>
                    <StructureCol
                        depData={depData}
                        num={6}
                        dep={dep}
                        depName={depName}
                    />
                    </Grid>
                }
                <Grid item xs={2}>
                    <Grid className={classes.paper}>Подразделения прямого подчинения управляющему</Grid>
                    <StructureCol
                        depData={depData}
                        num={5}
                        dep={dep}
                        depName={depName}
                    />
                </Grid>
                
                {user.role.id != 0 && dep &&
                    <Grid item xs={2}>
                        <Grid className={classes.paper}>Заштатные сотрудники</Grid>
                        <OutstateCol
                            depData={depData.out}
                        />
                    </Grid>
                }
        </Grid>
    )
}