import { Component, useState, useEffect  } from 'react';
import { Link, useParams, NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import '../Speciality/DetailSpeciality.scss';
import React from 'react';
import { Languages, Themes } from "../../utils/constant";
import { fetchGetDetailClinic} from '../../services/clinicService';
import DoctorSchedule from "../Patient/DoctorSchedule";
import DoctorExtrator from "../Patient/DoctorExtrator";
import DoctorProfile from "../Patient/DoctorProfile";
import Select from 'react-select';
import Comment from "../Social Plugins/Comment";
import LikeShared from "../Social Plugins/Like&Share";
import Header from '../Home/header';
import Footer from '../Home/footer';
const DetailClinic = (props) => {
    const { clinicID } = useParams();
    const [clinicDetail,setClinicDetail] = useState({})
    const [dataHref,setDataHref] = useState(+process.env.REACT_APP_LOCAL === 1 ? "https:/eric-restaurant-bot-tv.herokuapp.com/" : window.location.href)

    const getDetail = async () => {
        let res = await fetchGetDetailClinic(clinicID)
        if(res && res.EC === 0) {
            setClinicDetail(res.DT)
            if(res.DT && res.DT.Doctor_Infors ? res.DT.Doctor_Infors : [] ) {
                setListDoctor(res.DT.Doctor_Infors)
            }       
        }
    }

    useEffect(()=> {
        getDetail()
    },[])

    const [listDoctor,setListDoctor] = useState([])

    const [showMore,setShowMore] = useState(true)
    const handleShowMore = () => {
        setShowMore(!showMore)
    }

    return(
        <div className='index' data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
        <Header/>
        <div className='Detail-doctor speciality'>
            {
                clinicDetail && 
                <div className='container custom'>
                <p className='site'><NavLink to='/home'><i className="fa-solid fa-house"></i> <FormattedMessage id="header.home"/></NavLink> / <i className="fa-solid fa-star-of-life"></i> <FormattedMessage id="header.health-facility"/> / {clinicDetail.name} </p>
                </div>
            }
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        {
                            clinicDetail ?
                            <div className='speciality-info'>
                            <h4>{clinicDetail.name}</h4>
                            <p><i className="fa-solid fa-location-dot"></i> <FormattedMessage id="Clinic.address"/>: {clinicDetail.address}</p>
                            <p><FormattedMessage id="Clinic.info"/></p>
                            {
                                showMore === false ?
                                <>
                                <div dangerouslySetInnerHTML={{__html: clinicDetail.descriptionHTML}}>
                                </div>
                                <button onClick={()=>handleShowMore()}><i className="fa-solid fa-eye-slash"></i> <FormattedMessage id="common.hide detail"/></button>
                                </>
                                :
                                <div className='d-flex justify-content-between align-items-center'>
                                    <button onClick={()=>handleShowMore()}><i className="fa-solid fa-eye"></i> <FormattedMessage id="common.detail"/></button>
                                    <LikeShared dataHref={dataHref}/>
                                </div>
                            }
                            </div>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
            {
                listDoctor && listDoctor.length > 0 &&
                listDoctor.map((item,index)=> {
                    return(
                        <>
                        <div className="container content-height content p-3" key={index}>
                            <div className="row">
                                <div className="col-12 col-sm-6">
                                <DoctorProfile doctorId = {item.doctorId}/>
                                </div>
                                <div className="col-12 col-sm-6">
                                <DoctorSchedule doctorId={item.doctorId}/>
                                <DoctorExtrator doctorId={item.doctorId}/>
                                </div>
                            </div>
                        </div>
                        </>
                    )
                })
            }
            {/* <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <Comment dataHref={dataHref}/>
                    </div>
                </div>
            </div> */}
        </div>
        <Footer/>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        theme: state.app.theme,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
        doctorDetail: state.admin.detailDoctor,
        reduxDoctorRequired: state.admin.infoDoctor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxFetchDoctorRequired: () => dispatch(actions.fetchDoctorRequiredStart()),
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme)), 
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
