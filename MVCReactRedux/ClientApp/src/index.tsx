import 'bootstrap/dist/css/bootstrap.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import { loadUser } from "redux-oidc";
import { OidcProvider } from 'redux-oidc';
import userManager from "./userManager";

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href') as string;
export const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
export const store = configureStore(history);
loadUser(store, userManager);

ReactDOM.render(
    <Provider store={store}>
        <OidcProvider store={store} userManager={userManager}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </OidcProvider>
    </Provider>,
    document.getElementById('root'));

registerServiceWorker();
