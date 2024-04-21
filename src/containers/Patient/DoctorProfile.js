import Header from "../Home/header";
import { Component, useState, useEffect  } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import './DetailDoctor.scss';
import React from 'react';
import { Languages } from "../../utils/constant";
import { fetchDetailDoctor } from "../../services/doctorService";
import LikeShared from "../Social Plugins/Like&Share";

const DoctorProfile = (props) => {
    const [data,setData] = useState({})
    const getProfile = async (doctorId) => {
        let res = await fetchDetailDoctor(doctorId)
        if(res && res.EC === 0) {
            setData(res.DT)
        }
    }

    useEffect(()=>{
        if(props.doctorId) {
            getProfile(props.doctorId)
        }
    },[props.doctorId])

    return(
        <>
        <div className='col-12'>
            <div className="profile">
                <div className="avatar">
                    <img src={data && data.image ? data.image : ''} /> 
                </div>
                <div className="info">
                    <h4>{props.lang === Languages.VI ? `${data && data.Position && data.Position.valueVI} ${data.fullName}` : `${data && data.Position && data.Position.valueEN} ${data.fullName}`}</h4>
                    <p><i className="fa-solid fa-id-card"></i> {data && data.Doctor_Infor && data.Doctor_Infor.description}</p>
                    {
                        data && data.Doctor_Infor && data.Doctor_Infor.Province ?
                        <>
                        <p><i className="fa-solid fa-location-dot"></i> <FormattedMessage id="Doctor-info.office"/>: {props.lang === Languages.VI ? data.Doctor_Infor.Province && data.Doctor_Infor.Province.valueVI: data.Doctor_Infor.Province &&  data.Doctor_Infor.Province.valueEN}</p>
                        <p><i className="fa-solid fa-stethoscope"></i> <FormattedMessage id="slides.speciality"/>: {data.Doctor_Infor.Speciality && data.Doctor_Infor.Speciality.name}</p>
                        </>
                        :
                        <><p><i className="fa-solid fa-location-dot"></i> <FormattedMessage id="Doctor-info.office"/>:</p></>
                    }
                    <p><i className="fa-solid fa-phone"></i> <FormattedMessage id="Doctor-info.phone"/>: {data.phone}</p>
                    <p><i className="fa-solid fa-envelope"></i> <FormattedMessage id="Doctor-info.contact"/>: {data.email}</p>
                    <div className="mt-2">
                        <LikeShared dataHref={props.dataHref}/>
                    </div>
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
        isLoggedIn: state.user.isLoggedIn,
        doctorDetail: state.admin.detailDoctor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxGetDetailDoctor: (id) => dispatch(actions.getDetailDoctor(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorProfile);