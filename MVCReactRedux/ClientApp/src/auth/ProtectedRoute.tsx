import * as React from "react"
import { Route, RouteComponentProps, RouteProps } from "react-router-dom"
import { connect } from 'react-redux';
import userManager from "../userManager";
import { ApplicationState } from '../store';
import { UserState } from '../store/user';
import { history } from '../index'

interface ProtectedRouteProps extends RouteProps {
    user: UserState,
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>,
}

class ProtectedRoute extends Route<ProtectedRouteProps> {
    render() {
        const state = this.props;
        if (state.user.silentLoading) {
            console.log("- display checking user");
            return <div>Checking user ...</div>
        }
        else if (state.user.isLoading) {
            console.log("- display checking user");
            return <div>Checking user ...</div>
        }
        else if (state.user.loginRequired) {
            console.log("- login redirect: even though I'm not being displayed?");
            userManager.signinRedirect({
                data: {path: history.location.pathname},
            });
            return null;
        }
        return super.render();
    }
}

function mapStateToProps(state: ApplicationState) {
    return state;
}
export default connect(mapStateToProps)(ProtectedRoute);