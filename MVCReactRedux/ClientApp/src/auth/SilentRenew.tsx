import * as React from 'react';
import { processSilentRenew } from 'redux-oidc';
import { store } from '../index'
import * as Users from "../store/user";

const SilentRenewComponent = () => {
    processSilentRenew();
    store.dispatch(Users.userSilentComplete());
    return (
        <div></div>
    );
}

export default SilentRenewComponent;