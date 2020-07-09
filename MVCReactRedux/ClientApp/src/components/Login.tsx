import * as React from 'react';
import userManager from "../userManager";

const onLoginButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    userManager.signinRedirect();
};

const Login = () => {
    return (
        <button onClick={onLoginButtonClick}>Login</button>
    );
};

export default Login;