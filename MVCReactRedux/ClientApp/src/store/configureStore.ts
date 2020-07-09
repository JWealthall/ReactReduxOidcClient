import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { reducers } from './';
import userManager from '../userManager';
import { configureStore as configStore, getDefaultMiddleware } from '@reduxjs/toolkit'

export default function configureStore(history: History) {
    userManager.events.addSilentRenewError(error => {
        console.error('error while renewing the access token', error);
    });

    const rootReducer = combineReducers({
        ...reducers,
        router: connectRouter(history)
    });

    const enhancers = [];
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
    }

    return configStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["redux-oidc/USER_FOUND"]
            }
        })
    });
}

