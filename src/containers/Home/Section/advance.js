import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage } from "../../../store/actions/appActions";
import React from 'react';
import app1  from '../../../assets/images/app1.png';
import app2  from '../../../assets/images/app2.png';
import bg  from '../../../assets/images/advance.jpeg';

import './advance.scss';

const Advance = (props) => {
    return(
        <div className='advance'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='advance-content'>
                            <div className='advance-img'>
                                <img className='image hidden-advance' src={bg} alt='bg'/> 
                            </div>
                            <div className='advance-text'>
                                <h4>App <span>Booking<span>.Com</span></span></h4>
                                <ul>
                                    <li>
                                        <Link to="#"><i className="fa-solid fa-circle-check"></i><img className='img-app' src={app1} alt='app'/></Link>
                                    </li>
                                    <li>
                                        <Link to="#"><i className="fa-solid fa-circle-check"></i><img className='img-app' src={app2} alt='app'/></Link>
                                    </li>
                                </ul>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Advance);