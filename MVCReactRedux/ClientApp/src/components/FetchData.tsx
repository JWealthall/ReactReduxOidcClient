import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../store';
import * as ForecastStore from '../slices/WeatherForecasts'
import * as Types from '../types'

interface RouteParams {
    startDateIndex: string
}

export default function FetchData() {
    const dispatch = useDispatch();
    const forecastState = useSelector((state: ApplicationState) => state.weatherForecasts);
    const userState = useSelector((state: ApplicationState) => state.user);
    const params = useParams<RouteParams>();

    React.useEffect(() => {
        dispatch(ForecastStore.requestWeatherForecasts(parseInt(params.startDateIndex, 10) || 0));
    }, [dispatch, params, userState.accessToken]);
    // The access token is used here to force a reload if the user was loaded from Open ID after the first render

    const renderForecastsTable = () => {
        if (userState.accessToken === "")
            return (
                <p>Require authenticated user</p>
            );
        if (forecastState.isLoading)
            return (
                <p>Loading ...</p>
            );
        if (forecastState.isError)
            return (
                <p>Error! {forecastState.message}</p>
            );
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecastState.forecasts.map((forecast: Types.WeatherForecast) =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    const renderPagination = () => {
        if (userState.accessToken === "")
            return null;
        const prevStartDateIndex = (forecastState.startDateIndex || 0) - 5;
        const nextStartDateIndex = (forecastState.startDateIndex || 0) + 5;

        return (
            <div className="d-flex justify-content-between">
                <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${prevStartDateIndex}`}>Previous</Link>
                {forecastState.isLoading && <span>Loading...</span>}
                <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${nextStartDateIndex}`}>Next</Link>
            </div>
        );
    }

    return (
        <React.Fragment>
            <h1 id="tabelLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            {renderForecastsTable()}
            {renderPagination()}
        </React.Fragment>
    );
}
