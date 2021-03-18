import React from "react";
import Grid from "@material-ui/core/Grid";
import GraphChooser from './graphChooser'

export default React.memo(function (props) {
    const {numGraph, selected, type} = props;

    return <div style={{height: '100%'}}>
        {selected ?
            <div style={{height: '100%'}}>
                {numGraph === 1 &&
                <div style={{height: '100%', width: '100%'}} id={`11_graph_container`}>
                    <GraphChooser n={11} selected={selected} tb_gosb={type}/>
                </div>
                }
                {numGraph === 2 &&
                <Grid container style={{height: '100%'}} spacing={2}>
                    <Grid item xs={6} id={`21_graph_container`} style={{height: '100%'}}>
                        <GraphChooser n={21} selected={selected} tb_gosb={type}/>
                    </Grid>
                    <Grid item xs={6} id={`22_graph_container`} style={{height: '100%'}}>
                        <GraphChooser n={22} selected={selected} tb_gosb={type}/>
                    </Grid>
                </Grid>
                }
                {numGraph === 4 &&
                <Grid container style={{height: '100%'}} spacing={2}>
                    <Grid item xs={6}>
                        <Grid container direction={"row"} spacing={2} style={{height: '100%'}}>
                            <Grid item xs={12} style={{height: '50%'}} id={`41_graph_container`}>
                                <GraphChooser n={41} tb_gosb={type} selected={selected}/>
                            </Grid>
                            <Grid item xs={12} style={{height: '50%'}} id={`42_graph_container`}>
                                <GraphChooser n={42} tb_gosb={type} selected={selected}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container direction={"row"} spacing={2} style={{height: '100%'}}>
                            <Grid item xs={12} style={{height: '50%'}} id={`43_graph_container`}>
                                <GraphChooser n={43} selected={selected} tb_gosb={type}/>
                            </Grid>
                            <Grid item xs={12} style={{height: '50%'}} id={`44_graph_container`}>
                                <GraphChooser n={44} selected={selected} tb_gosb={type}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                }
            </div>
            :
            <p> Данный раздел находится в разработке. </p>
        }
    </div>
})