import './DetailDoctor.scss';
import { Component, useState, useEffect  } from 'react';
import { Link, useParams, NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import React from 'react';
import { Languages, Themes } from "../../utils/constant";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtrator from "./DoctorExtrator";
import DoctorProfile from "./DoctorProfile";
import Comment from "../Social Plugins/Comment";
import Header from '../Home/header';
import Footer from '../Home/footer';

const DetailDoctor = (props) => {
    const { id } = useParams();
    const [infoDr,setInfoDr] = useState()
    const [isloading,setLoading] = useState(true)
    const [dataHref,setDataHref] = useState(+process.env.REACT_APP_LOCAL === 1 ? "https:/eric-restaurant-bot-tv.herokuapp.com/" : window.location.href)
    const [cmt,setCmt] = useState()

    const getDetail = () => {
       props.reduxGetDetailDoctor(id)
    }

    useEffect(()=> {
        getDetail()
    },[id])

    useEffect(() => {
        if(props.doctorDetail) {
            setInfoDr(props.doctorDetail)
            setLoading(false)
        }
    }, [props.doctorDetail]);

    useEffect(() => {
        return () => {
            props.reduxGetDetailDoctor(null);
        };
    }, []);

    return (
        <div className='index' data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
            <Header/>
            <div className='Detail-doctor'>
                <div className='container custom'>
                <p className='site'><NavLink to='/home'><i className="fa-solid fa-house"></i> <FormattedMessage id="header.home"/></NavLink> / <i className="fa-solid fa-stethoscope"></i> <FormattedMessage id="Doctor-info.detail"/></p>
                </div>
                {
                    isloading === true ?
                    <div className='circle-loading'>
                    </div>
                    :
                    <>
                    <div className='container'>
                        <div className='row'>
                            <DoctorProfile doctorId = {infoDr.id} dataHref={dataHref}/>
                        </div>
                    </div>
                    <div className="container content-height content p-3">
                        <div className="row">
                            <div className="col-12 col-sm-6"><DoctorSchedule doctorId = {infoDr.id}/></div>
                            <div className="col-12 col-sm-6"><DoctorExtrator doctorId = {infoDr.id}/></div>
                        </div>
                    </div>
                    {   
                        infoDr && infoDr.Doctor_Infor && infoDr.Doctor_Infor.contentHTML !== null ?
                        <div className="container content p-3">
                            <div className="row">
                                <div className="col-12">
                                    <div dangerouslySetInnerHTML={{__html: infoDr.Doctor_Infor.contentHTML}}></div>
                                </div>
                            </div>
                        </div>
                        :
                        <></>
                    }
                    <div className='container'>
                        <div className='row'>
                            <div className="col-12">
                                {/* <Comment dataHref={dataHref}/>  */}
                                <Comment doctorId = {infoDr.id}/>
                            </div>
                        </div>
                    </div>
                    </>
                }   
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
        doctorDetail: state.admin.detailDoctor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxGetDetailDoctor: (id) => dispatch(actions.getDetailDoctor(id)),
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);