import { Component, useState, useEffect  } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import React from 'react';
import { Languages, Themes } from "../../utils/constant";
import { fetchComment } from "../../services/doctorService";
import './comment.scss';
import avatar  from '../../assets/images/avatar.png';
import { Buffer } from 'buffer';

const Comment= (props) => {

    const [cmt,setCmt] = useState([])

    const getCmt = async (doctorId) => {
        let res = await fetchComment(doctorId)
        if(res && res.EC === 0) {
            setCmt(res.DT)
        }
    }

    const formatDate = (date) => {
        let datePart = date.split("-"),
        format = `${datePart[2]}/${datePart[1]}/${datePart[0]}`;
        return format;
    }
    
    useEffect(()=>{
        getCmt(props.doctorId)
    },[props.doctorId])

    // const initFacebookSDK= () => {
    //     if (window.FB) {
    //         window.FB.XFBML.parse();
    //     }
    //     let locale = props.lang === Languages.VI ? 'vi_VN' : 'en_US'
    //     window.fbAsyncInit = function () {
    //         window.FB.init({
    //             appId: process.env.REAC_APP_BOOKING_APP_ID,
    //             cookie: true,  // enable cookies to allow the server to access
    //             // the session
    //             xfbml: true,  // parse social plugins on this page
    //             version: 'v2.5' // use version 2.1
    //         });
    //     };
    //     // Load the SDK asynchronously
    //     (function (d, s, id) {
    //         var js, fjs = d.getElementsByTagName(s)[0];
    //         if (d.getElementById(id)) return;
    //         js = d.createElement(s); js.id = id;
    //         js.src = `//connect.facebook.net/${locale}/sdk.js`;
    //         fjs.parentNode.insertBefore(js, fjs);
    //     }(document, 'script', 'facebook-jssdk'));
    // }
    
    // useEffect(()=>{
    //     initFacebookSDK()
    // },[])

    // return(
    //     <>
    //         <div className="fb-comments" 
    //         data-href={props.dataHref}
    //         data-width="100%" 
    //         data-numposts="5"></div>
    //     </>
    // )
     return (
        <>
        {   
            cmt && cmt.length > 0 &&
            <div className='comment'>
                <h4><FormattedMessage id="system.product-manage.Comment"/></h4>
                <ul>
                    {
                        cmt.map((item,index)=> {
                            return(
                                <li key={index}>
                                    <div className='item-user'>
                                        <div className='img'>
                                            <img src={item.patientData && item.patientData.image ? Buffer(item.patientData.image,'base64').toString('binary') : avatar}/>
                                        </div>
                                        <div className='text'>
                                            <p><span>{item.patientData && item.patientData.fullName} </span><i className="fa-solid fa-circle-check"></i> <FormattedMessage id="system.product-manage.Booked On"/> {formatDate(item.date)}</p>
                                            <p>{item.comment}</p>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div> 
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Comment);