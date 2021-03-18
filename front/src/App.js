import React, { useEffect } from 'react';
import Testpage from './components/test/test';
import Stub from './components/stub/stubNetwork';
import Privilege from './components/stub/stubPrivege';
import EtalonMain from './components/etalon/etalonMain';
import { ThemeProvider } from '@material-ui/core/styles';
import { Route, Switch } from "react-router-dom";
import UpMenu from './components/upMenu/upMenu';
import Map from './components/map/map';
import DepMain from './components/depMain/depMain';
import DepTree from './components/depTree/depTree';
import theme from './components/theme/theme';
import AdminPanel from "./components/adminTools/AdminPanel";
import Logs from "./components/adminTools/logs";
import Match from './components/match/main';
import Grid from '@material-ui/core/Grid';
import { setAuth } from './redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import KicMain from './components/kic/kicMain';
import VspMain from './components/vsp/vspMain';
import DeviationModal from './components/deviations/tables/deviationModal';
import SapDevModal from './components/deviations/sap/sapDevModal';
import {StructureMain} from './components/structure/structureMain';
import axios from 'axios';
import ErrorReportModal from './components/reportError/errorReportModal';

function App(props) {
  let dispatch = useDispatch();
  useEffect(() => {
    axios.post('initial', {})
      .then(res => {dispatch(setAuth(res.data)); })
      .catch(error => dispatch(setAuth({user:false})))
  }, [dispatch]);
  let user = useSelector(state => state.mainReducer.user);
  let date = useSelector(state => state.mainReducer.date);
  let errorReportModal = useSelector(state => state.mainReducer.errorReportModal);
  const [deviationModal, setDeviationModal] = React.useState(false);
  return (
    <Grid container >
      <ThemeProvider theme={theme}>
        {user && user.role.id !== 22 && <UpMenu setDeviationModal={setDeviationModal}/>}

        <Switch>
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/apierr/:problem'} component={Stub} />
        </Switch>
        {user && user.role.id === 22 &&
          <Switch>
             <Route history={props.history} path={process.env.REACT_APP_BASE+'/'} component={Logs} />
          </Switch>
        }
        {
          date && user && user.role.id !== 22 &&

        <Switch>
          <Route history={props.history} exact path={process.env.REACT_APP_BASE+'/'} component={Map} />
          {user && user.role.id === 14 &&
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/logs'} component={Logs} />
          }
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/gosb'} component={Stub} />
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/testpage'} component={Testpage} />
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/privilege'} component={Privilege} />
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/etalon/:type'} component={EtalonMain} />
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/admin'} component={AdminPanel} />
          {user && user.role.id === 17 &&
            <Route history={props.history} path={process.env.REACT_APP_BASE+'/match'} component={Match} />
          }
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/dep/:depName/:dep?'} component={DepMain} />
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/deptree/:depName/:dep?/:id'} component={DepTree} />
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/kic'} component={KicMain} />
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/vsp'} component={VspMain} />
          <Route history={props.history} path={process.env.REACT_APP_BASE+'/structure'} component={StructureMain} />
        </Switch>
        }
        {
          deviationModal &&
          <DeviationModal
              deviationRedactor={deviationModal}
              setDeviationRedactor={setDeviationModal}
          />
        }
        {Boolean(errorReportModal) &&
        <ErrorReportModal/>
        }
        <SapDevModal/>
      </ThemeProvider>
    </Grid>
  );
}

export default App;
