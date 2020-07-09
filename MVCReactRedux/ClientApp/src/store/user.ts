import * as Oidc from "redux-oidc";
import { Profile } from 'oidc-client';

export const USER_SILENT_COMPLETE: string = "USER_SILENT_COMPLETE";
export const USER_SILENT_START: string = "USER_SILENT_START";
export const LOGIN_REQUIRED: string = "LOGIN_REQUIRED";
export const LOGIN_COMPLETE: string = "LOGIN_COMPLETE";

export function userSilentComplete() {
    return {
        type: USER_SILENT_COMPLETE
    };
}

export function userSilentStart() {
    return {
        type: USER_SILENT_START
    };
}

export function loginRequired() {
    return {
        type: LOGIN_REQUIRED
    };
}

export function loginComplete() {
    return {
        type: LOGIN_COMPLETE
    };
}

export interface UserState {
    silentLoading: boolean;
    loginRequired: boolean;
    isLoading: boolean;
    isExpired: boolean;
    name: string;
    accessToken: string;
    profile?: Profile;
    //user?: User;  // Can't use this as not serializable
}

const initialState: UserState = {
    silentLoading: false,
    loginRequired: false,
    isLoading: true,
    isExpired: false,
    name: "",
    accessToken: "",
};

function userReducer(state = initialState, action: any) {
    if (action.type === Oidc.USER_EXPIRED) {
        console.log("User expired! " + JSON.stringify(action.payload));
        return { ...initialState, isLoading: false, isExpired: true, silentLoading: state.silentLoading };
    }
    if (action.type === Oidc.USER_FOUND) {
        console.log("Found a user! " + JSON.stringify(action.payload));
        if (action.payload)
            if (action.payload.profile)
                return { ...initialState, isLoading: false, profile: action.payload.profile, accessToken: action.payload.access_token, name: action.payload.profile.name };
            else
                return { ...initialState, isLoading: false, accessToken: action.payload.access_token };
        else
            return { ...initialState, isLoading: false, isExpired: true };
    }
    if (action.type === Oidc.SILENT_RENEW_ERROR) {
        console.log("Silent renew error! " + JSON.stringify(action.payload));
        return { ...initialState, isLoading: false, isExpired: true };
    }
    if (action.type === Oidc.SESSION_TERMINATED) {
        console.log("Session terminated! " + JSON.stringify(action.payload));
        return { ...initialState, isLoading: false, isExpired: true };
    }
    if (action.type === Oidc.USER_EXPIRING) {
        console.log("User expiring! " + JSON.stringify(action.payload));
    }
    if (action.type === Oidc.LOADING_USER) {
        console.log("Loading a user! " + JSON.stringify(action.payload));
        return { ...initialState, silentLoading: state.silentLoading };
    }
    if (action.type === Oidc.USER_SIGNED_OUT) {
        console.log("User signed out! " + JSON.stringify(action.payload));
        return { ...initialState, isLoading: false };
    }
    if (action.type === Oidc.LOAD_USER_ERROR) {
        console.log("Load user error! " + JSON.stringify(action.payload));
        return { ...initialState, isLoading: false };
    }
    if (action.type === USER_SILENT_COMPLETE) {
        console.log("User silent complete! " + JSON.stringify(action.payload));
        return { ...state, silentLoading: false };
    }
    if (action.type === USER_SILENT_START) {
        console.log("User silent start! " + JSON.stringify(action.payload));
        return { ...state, silentLoading: true };
    }
    if (action.type === LOGIN_REQUIRED) {
        console.log("Login required! " + JSON.stringify(action.payload));
        return { ...state, loginRequired: true, silentLoading: false };
    }
    if (action.type === LOGIN_COMPLETE) {
        console.log("Login complete! " + JSON.stringify(action.payload));
        return { ...state, loginRequired: false, silentLoading: false };
    }
    return state;
}

export default userReducer;