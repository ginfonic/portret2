import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import rootReducer from './redux/rootReducer';
import thunk from 'redux-thunk';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import './index.css'

axios.defaults.baseURL = process.env.REACT_APP_URL;


export const history = createBrowserHistory();
const composeEnhancers = composeWithDevTools({});
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
  );
  
  axios.interceptors.response.use(undefined, error => {
   
    if (error.message === 'Network Error' && !error.response) {
      history.push(`${process.env.REACT_APP_BASE}/apierr/network`);
      return
    }
    const { status } = error.response;
    if (status === 401) {
      history.push(`${process.env.REACT_APP_BASE}/apierr/user`);
      return
    }
    if (status === 500) {
      history.push(`${process.env.REACT_APP_BASE}/apierr/network`);
      return
    }
    if (status === 404) {
      history.push(`${process.env.REACT_APP_BASE}/apierr/notfound`);
      return
    }
  });

  ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
