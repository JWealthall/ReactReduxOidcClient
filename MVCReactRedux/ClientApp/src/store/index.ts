import CounterReducer, * as Counter from '../slices/Counter'
import WeatherForecastsReducer, * as WeatherForecasts from '../slices/WeatherForecasts'
import WeatherForecastsNoAuthReducer from '../slices/WeatherForecastsNoAuth'
import UserReducer, * as Usr from './user'

// The top-level state object
export interface ApplicationState {
    counter: Counter.CounterState;
    weatherForecasts: WeatherForecasts.WeatherForecastsState;
    weatherForecastsNoAuth: WeatherForecasts.WeatherForecastsState;
    user: Usr.UserState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    counter: CounterReducer,
    weatherForecasts: WeatherForecastsReducer,
    weatherForecastsNoAuth: WeatherForecastsNoAuthReducer,
    user: UserReducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
