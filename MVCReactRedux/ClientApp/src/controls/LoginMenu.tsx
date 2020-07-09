import * as React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { useSelector } from 'react-redux';
import userManager from "../userManager";
import { history } from '../index'

export default function LoginMenu() {
    const userState = useSelector((state: any) => state.user);

    const onLoginButtonClick = (event: React.MouseEvent) => {
        event.preventDefault();
        userManager.signinRedirect({
            data: { path: history.location.pathname },
        });
    };

    const onLogoutButtonClick = (event: React.MouseEvent) => {
        event.preventDefault();
        userManager.signoutRedirect();
    };

    if (userState.silentLoading || userState.isLoading) {
        return (
            <span className="navbar-text">... loading ...</span>
        );
    }

    if (!userState.profile)
        return (
            <NavItem>
                { /* href can be something that looks real as it is prevented by the click event */}
                <NavLink href="/logIn" onClick={onLoginButtonClick}>Log In</NavLink>
            </NavItem>
        );
    else
        return (
            <React.Fragment>
                <span className="navbar-text">{userState.profile.given_name}</span>
                <NavItem>
                    { /* href can be something that looks real as it is prevented by the click event */}
                    <NavLink href="/logOut" onClick={onLogoutButtonClick}>Log Out</NavLink>
                </NavItem>
            </React.Fragment>
        );
}