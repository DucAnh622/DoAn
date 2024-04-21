import { Component, useState, useEffect  } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import React from 'react';
import { Languages, Themes } from "../../utils/constant";

const LikeShared = (props) => {

    const initFacebookSDK= () => {
        if (window.FB) {
            window.FB.XFBML.parse();
        }
        let locale = props.lang === Languages.VI ? 'vi_VN' : 'en_US'
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: process.env.REAC_APP_BOOKING_APP_ID,
                cookie: true,  // enable cookies to allow the server to access
                // the session
                xfbml: true,  // parse social plugins on this page
                version: 'v2.5' // use version 2.1
            });
        };
        // Load the SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = `//connect.facebook.net/${locale}/sdk.js`;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
    
    useEffect(()=>{
        initFacebookSDK()
    },[])

    return(
        <>
            <div className="fb-like" 
            data-href={props.dataHref}
            data-width={props.dataWidth} 
            data-layout="button" 
            data-action="like" 
            data-size="large" 
            data-share="true"></div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        theme: state.app.theme,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LikeShared);