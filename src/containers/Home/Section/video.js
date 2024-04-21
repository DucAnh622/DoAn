import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage } from "../../../store/actions/appActions";
import React from 'react';
import logo  from '../../../assets/images/logo.png';
import './video.scss';


const Video = (props) => {
    return(
        <div className='video hospital'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='video-title'>
                            <h4><FormattedMessage id="slides.about"/></h4>
                        </div>
                    </div>
                    <div className='col-12 col-sm-6 col-lg-6'>
                        <div className='video-content'>
                            <iframe style={{width:"100%",height:"300px",objectFit:"cover"}} src="https://www.youtube.com/embed/Vdm6i1m4tDE" title="Bước Qua Nhau / Vũ. (Live Session trên tàu Cát Linh - Hà Đông)" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                        </div>
                    </div>
                    <div className='col-12 col-sm-6 col-lg-6'>
                        <div className='video-logo'>
                            <img src={logo} alt="logo"/>
                            <p><FormattedMessage id="slides.about des"/></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Video);