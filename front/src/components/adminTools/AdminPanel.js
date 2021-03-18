import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import SapFilesList from './sapFiles/sapFilesList';
import Container from "@material-ui/core/Container";
import MatchingControls from './matchingControls/matchingControls';
import {FnblockMain} from './fnblock/fnblockMain';
import OtherControls from './otherFunctions/otherFunctions';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      marginTop: 15,
    },
    paper: {
        height: '98%',
    }
}));

export default function Admin() {
    const classes = useStyles();
    const user = useSelector(state => state.mainReducer.user);
    const loadData = new Set([22, 17]);
    return (
        <React.Fragment>
          <Container maxwidth={"sm"} className={classes.root}>
              <Paper elevation={2}>
                  <OtherControls/>
              </Paper>
            {loadData.has(user.role.id) &&
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper elevation={2} className={classes.paper}>
                    <SapFilesList/>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Grid
                        container
                        direction={"column"}
                    >
                        <Grid>
                            <Paper elevation={2}>
                                <MatchingControls/>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper elevation={2}>
                                <FnblockMain/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
              </Grid>
            }
          </Container>
        </React.Fragment>
    );
}
