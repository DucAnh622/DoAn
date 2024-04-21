import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import logo  from '../../assets/images/logoDB.jpg';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu, patientMenu } from './menuApp';
import './Header.scss';
import { FormattedMessage } from 'react-intl';
import { Languages, roleUsers } from "../../utils/constant";
import { NavLink } from 'react-router-dom';
import { Buffer } from 'buffer';
import { useEffect } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import avatar  from '../../assets/images/avatar.png';

const Header = (props) => {
    const handleChangeLanguage = (language) => {
        props.reduxChangeLanguage(language)
    }
    
    return(
    <>
        <div className="header-container">
            <div className='logo'>
                <img src={logo}/>
            </div>
            <div className="header-tabs-container">
            </div>
            <div className='option'>
                <div className='header-user'>
                    <img alt='' src={props.userInfo && props.userInfo.image ? Buffer(props.userInfo.image,'base64').toString('binary') : avatar }/>
                    <p>{props.userInfo && props.userInfo.fullName ? props.userInfo.fullName : ''}</p>
                </div>
                <div className='setting'>
                    {
                        props.lang === "vi" ?
                        <span onClick={()=>handleChangeLanguage(Languages.EN)}>EN</span>
                        :
                        <span onClick={()=>handleChangeLanguage(Languages.VI)}>VI</span>
                    }
                </div>
                <div className="btn btn-logout" onClick={props.processLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                </div>
            </div>
        </div>
    </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        reduxChangeLanguage: (language) => dispatch(actions.appChangeLanguage(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
