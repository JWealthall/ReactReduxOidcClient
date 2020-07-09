import { createUserManager } from 'redux-oidc';
import { UserManagerSettings, Log } from 'oidc-client';
import { store } from './index'
import * as Users from "./store/user";

const userManagerConfig: UserManagerSettings = {
    authority: 'https://localhost:5001',
    client_id: 'redux',
    redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
    post_logout_redirect_uri:  `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/`,
    response_type: "code",
    scope: "openid profile email address api2",
    silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silentrenew`,
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    revokeAccessTokenOnSignout: true,
    loadUserInfo: true,
    monitorSession: false,
    client_secret: "secret"
};

Log.logger = console;
Log.level = Log.DEBUG;

const userManager = createUserManager(userManagerConfig);

// This forces a silent renew when the page is loaded if there's not existing user
function checkforUser() {
    if (window.location.pathname.substring(0, 9) === '/callback') return;
    console.log("Checking for a user");
    userManager.getUser().then(user => {
        if (user) {
            //console.log("User logged in", JSON.stringify(user));
            //console.log("User logged in", user.profile);
        }
        else {
            try {
                store.dispatch(Users.userSilentStart());
                console.log("Starting silent sign in");
                userManager.signinSilent({ useReplaceToNavigate: true }).catch(error => {
                    store.dispatch(Users.loginRequired());
                    console.log("Error " + JSON.stringify(error));
                });
                console.log("Completing silent sign in");
            } catch (e) {
                //console.log("Error");
            } 
        }
    });
}
checkforUser();

export default userManager;