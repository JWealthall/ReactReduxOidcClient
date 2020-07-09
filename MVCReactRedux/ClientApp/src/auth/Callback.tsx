import * as React from 'react';
import { connect } from 'react-redux';
import { User } from 'oidc-client';
import userManager from '../userManager';
import { Dispatch } from 'redux';
import { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import * as Users from "../store/user";

interface CallbackProps {
    dispatch: Dispatch;
    signInParams: string;
}

const Callback = (props: CallbackProps) => {
    const history = useHistory();
    const successCallback = (user: User) => {
        props.dispatch(Users.loginComplete());
        //TODO : Fix this
        var redirectPath = user.state.path as string;
        history.push(redirectPath);
    };

    const errorCallback = (error: Error) => {
        console.log(error);
        history.push('/');
    };

    // by default userManager gets params from the current route
    // eg. 'localhost:5100/callback#token_id=...&session_state=...
    //                              ------------------------------
    // this doesn't work when using hash history as the first hash messed up the process
    // eg. 'localhost:5100/#/callback#token_id=...&session_state=...
    // need to pass the token manually to signinRedirectCallback function

    useEffect(() => {
        console.log(props.signInParams);
        userManager
            .signinRedirectCallback(props.signInParams)
            .then(user => successCallback(user))
            .catch(error => errorCallback(error));
    });

    return <div>Loading...</div>;
};

export default connect()(Callback);