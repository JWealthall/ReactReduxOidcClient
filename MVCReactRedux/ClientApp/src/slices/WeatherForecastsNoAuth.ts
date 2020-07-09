import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationState } from '../store';
import { Dispatch } from 'redux';
import { WeatherForecast } from '../types'
import { WeatherForecastsState, WeatherForecastsError } from './WeatherForecasts'

const initialState: WeatherForecastsState = { forecasts: [], isLoading: false, isError: false, message: "" };

const weatherForecastSlice = createSlice({
    name: 'weatherForecastNoAuth',
    initialState: initialState,
    reducers: {
        forecastsNoAuthRequested: (state: WeatherForecastsState, action: PayloadAction<number>) => {
            state.isLoading = true;
            state.startDateIndex = action.payload;
            state.message = "";
        },
        forecastsNoAuthReceived: (state: WeatherForecastsState, action: PayloadAction<WeatherForecastsState>) => {
            const payload: WeatherForecastsState = action.payload;
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (state.startDateIndex === payload.startDateIndex) {
                state.isLoading = false;
                state.isError = false;
                state.forecasts = payload.forecasts;
            }
        },
        forecastsNoAuthError: (state: WeatherForecastsState, action: PayloadAction<WeatherForecastsError>) => {
            const payload: WeatherForecastsError = action.payload;
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (state.startDateIndex === payload.startDateIndex) {
                state.isLoading = false;
                state.isError = true;
                state.forecasts = [];
                state.message = payload.message;
            }
        },
    }
});

export default weatherForecastSlice.reducer

function status(response: Response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error("Status: " + response.status + " - " + response.statusText));
    }
}

export function requestWeatherForecastsNoAuth(startDateIndex: number) {
    return async (dispatch: Dispatch, getState: () => ApplicationState) => {
        const appState = getState();
        if (appState && appState.weatherForecasts && startDateIndex !== appState.weatherForecasts.startDateIndex) {
            const actions = weatherForecastSlice.actions;
            dispatch(actions.forecastsNoAuthRequested(startDateIndex));
            try {
                fetch('weatherforecastnoauth')
                    .then(status)
                    .then(response => {
                        return response.json() as Promise<WeatherForecast[]>;
                    })
                    .then(data => {
                        dispatch(actions.forecastsNoAuthReceived({ ...appState.weatherForecasts, startDateIndex: startDateIndex, forecasts: data }));
                    })
                    .catch(error => {
                        const err: Error = error;
                        dispatch(actions.forecastsNoAuthError({ startDateIndex: startDateIndex, message: err.message }));
                    });

            } catch (e) {
                dispatch(actions.forecastsNoAuthError({ startDateIndex: startDateIndex, message: "unknown error" }));
            }

            //try {
            //    const token = await authService.getAccessToken();
            //    const response = await fetch('weatherforecast', {
            //        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            //    });
            //    const data = await response.json();
        }
    };
}
