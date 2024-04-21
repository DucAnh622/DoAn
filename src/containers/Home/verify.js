import Footer from "../Home/footer";
import Header from "../Home/header";
import { connect } from 'react-redux';
import './index.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { appChangeLanguage, appChangeTheme} from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import React from "react";
import { fetchVerify } from '../../services/patientService';
import { Themes } from "../../utils/constant";
import successImg from '../../assets/images/successVerify.jpg';
import errorImg from '../../assets/images/errorVerify.jpg';

const Verify = (props) => {
    
    const [status,setStatus] = useState(false)
    const [isLoading,setLoading] = useState(true)

    const confirmBooking = async () => {
        const URLParams = new URLSearchParams(window.location.search);
        const StaffId = URLParams.get('staffId')
        const DoctorId = URLParams.get('doctorId')
        const PatientId = URLParams.get('patientId')
        let data = {
            staffId: StaffId,
            doctorId: DoctorId,
            patientId: PatientId
        }
        if(props.match && props.match.params) {
            let res = await fetchVerify(data)
            if(res && res.EC === 0) {
                setStatus(true)
                setLoading(false)
            }
            else {
                setStatus(false)
                setLoading(false)
            }
        }
    } 

    useEffect(()=>{
        confirmBooking()
    },[props.match])

    return (
        <>
        <div className="index" data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
            <Header/>
            <div className="container">
            {   
                isLoading === true ?
                <>
                <div className='circle-loading'>
                </div>
                </>
                :
                <>
                { status === true ?
                    <div className="verify-form text-center">
                    <h4><FormattedMessage id="Verify.save"/></h4>
                    <img className="image-verify" src={successImg} />
                    <p><FormattedMessage id="Verify.thank"/></p>
                    </div>
                :
                <div className="verify-form text-center">
                    <h4><FormattedMessage id="Verify.error"/></h4>
                    <img className="image-verify" src={errorImg} />
                </div>
                }
                </>    
            }
            </div>
            <Footer/>
        </div>
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
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
