import * as React from 'react';
import { Route, Switch } from 'react-router';
import Layout from '../components/Layout';
import Home from '../components/Home';
import Counter from '../components/Counter';
import FetchData from '../components/FetchData';
import Callback from '../auth/Callback';
import SilentRenew from '../auth/SilentRenew'
import Login from '../components/Login'
import ProtectedRoute from '../auth/ProtectedRoute'

import { useLocation } from "react-router-dom";

import './custom.css'

export default function App() {
    const location = useLocation();

    // TODO: Change this so that it appears in the switch
    const url = location.pathname.substring(0, 9);
    if (url === '/callback') {
        const rest = location.search.substring(1);
        return <Callback signInParams={`${url}?${rest}`} />;
    }

    return (
        <React.Fragment>
            <Switch>
                <Route path='/silentrenew'><SilentRenew /></Route>
                { /* <Route path='/callback.html' component={CallbackPage} /> */}
                <Route>
                    <Layout>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route path='/counter' component={Counter} />
                            { /* ProtectedRoute must be used inside a "Switch" if not it still attempts a render which will cause a sign in redirect */ }
                            <ProtectedRoute path='/fetch-data/:startDateIndex?' component={FetchData} />
                            <Route path='/Login' component={Login} />
                        </Switch>
                    </Layout>
                </Route>
            </Switch>
        </React.Fragment>

    );
}
