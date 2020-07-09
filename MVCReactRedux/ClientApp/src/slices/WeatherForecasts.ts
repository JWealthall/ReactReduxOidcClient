import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationState } from '../store';
import { Dispatch } from 'redux';
import { WeatherForecast } from '../types'

export interface WeatherForecastsState {
    isLoading: boolean;
    isError: boolean;
    message: string;
    startDateIndex?: number;
    forecasts: WeatherForecast[];
}

export interface WeatherForecastsError {
    message: string;
    startDateIndex?: number;
}

const initialState: WeatherForecastsState = { forecasts: [], isLoading: false, isError: false, message: "" };

const weatherForecastSlice = createSlice({
    name: 'weatherForecast2',
    initialState: initialState,
    reducers: {
        forecastsRequested: (state: WeatherForecastsState, action: PayloadAction<number>) => {
            state.isLoading = true;
            state.startDateIndex = action.payload;
            state.message = "";
        },
        forecastsReceived: (state: WeatherForecastsState, action: PayloadAction<WeatherForecastsState>) => {
            const payload: WeatherForecastsState = action.payload;
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (state.startDateIndex === payload.startDateIndex) {
                state.isLoading = false;
                state.isError = false;
                state.forecasts = payload.forecasts;
            }
        },
        forecastsError: (state: WeatherForecastsState, action: PayloadAction<WeatherForecastsError>) => {
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

export function requestWeatherForecasts(startDateIndex: number) {
    return async (dispatch: Dispatch, getState: () => ApplicationState) => {
        const appState = getState();
        if (appState && appState.weatherForecasts && (startDateIndex !== appState.weatherForecasts.startDateIndex)) {
            const actions = weatherForecastSlice.actions;
            if (appState.user && appState.user.profile) {
                const token = appState.user.accessToken;
                dispatch(actions.forecastsRequested(startDateIndex));
                try {
                    fetch('weatherforecast',
                        {
                            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                        })
                        .then(status)
                        .then(response => {
                            return response.json() as Promise<WeatherForecast[]>;
                        })
                        .then(data => {
                            dispatch(actions.forecastsReceived({
                                ...appState.weatherForecasts,
                                startDateIndex: startDateIndex,
                                forecasts: data
                            }));
                        })
                        .catch(error => {
                            const err: Error = error;
                            dispatch(actions.forecastsError({ startDateIndex: startDateIndex, message: err.message }));
                        });

                } catch (e) {
                    dispatch(actions.forecastsError({ startDateIndex: startDateIndex, message: "unknown error" }));
                }
            } else {
                if (startDateIndex !== appState.weatherForecasts.startDateIndex)
                    dispatch(actions.forecastsError({ startDateIndex: startDateIndex, message: "user not logged in" }));
            }
        }
    };
}
