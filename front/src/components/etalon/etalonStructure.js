import React from 'react';
import EtalonStructureCol from './etalonStructureCol';
import EtalonPart from './etalonPart';
import DescriptionModal from './modals/descriptionModal';
import SettingsModal from './modals/settingsModal';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        minHeight: '40px',
        color: 'green'
    },
}));

export default function EtalonStructure(props) {
    const { type, deps, getDeps, subdep } = props;
    const classes = useStyles();
    const info = useSelector(state => state.mainReducer.descriptionModal);
    const setting = useSelector(state => state.mainReducer.settingModal);
    return (
        <>
            {deps &&
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={5}>
                        </Grid>
                        <Grid item xs={2}>
                        {deps.filter(i => i.lvl === 1).map(i =>
                            <EtalonPart
                                name={i.name}
                                lvl={i.lvl}
                                id={i.id}
                                deps={deps}
                                notes={i.notes}
                                text={i.text}
                                flat={i.flat}
                                key={i.id}
                                block={i.funcblock}
                                subpart={i.subpart}
                        />
                            )}
                        </Grid>
                    <Grid item xs={5}>
                        <Grid container>
                        </Grid>
                    </Grid>
                        <Grid item xs={2}>
                            <Grid className={classes.paper}>Блок Розничный блок и Сеть продаж</Grid>
                            <EtalonStructureCol
                                deps={deps}
                                block={'Блок Розничный блок и Сеть продаж'}
                                subdep={subdep}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Grid className={classes.paper}>Блок Корпоративно-инвестиционный бизнеc</Grid>
                            <EtalonStructureCol
                                deps={deps}
                                block={'Блок Корпоративно-инвестиционный бизнес'}
                                subdep={subdep}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Grid className={classes.paper}>Блок Работа с ПА и правовые вопросы</Grid>
                            <EtalonStructureCol
                                deps={deps}
                                block={'Блок Работа с ПА и правовые вопросы'}
                                subdep={subdep}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Grid className={classes.paper}>Региональный сервисный центр</Grid>
                            <EtalonStructureCol
                                deps={deps}
                                block={'Блок Сервисы'}
                                subdep={subdep}
                            />
                        </Grid>
                        {type === 'tb' && 
                            <Grid item xs={2}>
                                <Grid className={classes.paper}>HR</Grid>
                                <EtalonStructureCol
                                    deps={deps}
                                    block={'Блок HR'}
                                    subdep={subdep}
                                />
                            </Grid>
                        }
                        <Grid item xs={2}>
                            <Grid className={classes.paper}>{type === 'tb' ? 'Блок Прямое подчинение Председателю' : 'Блок Прямое подчинение Управляющему'}</Grid>
                            <EtalonStructureCol
                                deps={deps}
                                block={'Прямое подчинение'}
                                subdep={subdep}
                            />
                        </Grid>
                    </Grid>
                </div>
            }
            {info && <DescriptionModal/>}
            {setting && <SettingsModal getDeps={getDeps} type={type} />}
        </>
    );
}