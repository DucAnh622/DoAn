import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { roleUsers } from '../utils/constant';

class Home extends Component {

    render() {
        const { isLoggedIn, userInfo } = this.props;
        let linkToRedirect = ""
        if (isLoggedIn) {
            switch (userInfo.roleId) {
                case roleUsers.ADMIN:
                    linkToRedirect = "/system/dashboard";
                    break;
                case roleUsers.DOCTOR:
                    linkToRedirect = "/doctor/dashboard";
                    break;
                case roleUsers.STAFF:
                    linkToRedirect = "/system/dashboard";
                    break;    
                default:
                    linkToRedirect = "/home";
            }
        }
        else {
            linkToRedirect = "/home"
        }
        return (
            <Redirect to={linkToRedirect} />
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
