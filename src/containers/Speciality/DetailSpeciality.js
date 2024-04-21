import { Component, useState, useEffect  } from 'react';
import { Link, useParams, NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import '../Patient/DetailDoctor.scss';
import '../Speciality/DetailSpeciality.scss';
import React from 'react';
import { Languages, Themes } from "../../utils/constant";
import { fetchGetDetailSpeciality, fetchGetDoctorByProvince} from '../../services/specialityService';
import DoctorSchedule from "../Patient/DoctorSchedule";
import DoctorExtrator from "../Patient/DoctorExtrator";
import DoctorProfile from "../Patient/DoctorProfile";
import Header from '../Home/header';
import Footer from '../Home/footer';

const DetailSpeciality = (props) => {
    const { specialityID } = useParams();
    const [specialityDetail,setSpecialityDetail] = useState({})
    const [listProv,setListProv] = useState([])

    const getDetail = async () => {
        let res = await fetchGetDetailSpeciality(specialityID)
        if(res && res.EC === 0) {
            setSpecialityDetail(res.DT)
            if(res.DT && res.DT.Doctor_Infors ? res.DT.Doctor_Infors : [] ) {
                setListDoctor(res.DT.Doctor_Infors)
            }       
        }
    }

    const getListProv = () => {
        props.reduxFetchDoctorRequired()
    }

    useEffect(()=> {
        setListProv(props.reduxDoctorRequired.ProRes)
    },[props.reduxDoctorRequired.ProRes])

    useEffect(()=> {
        getDetail()
        getListProv()
    },[props.lang])

    const [listDoctor,setListDoctor] = useState([])

    const [showMore,setShowMore] = useState(true)
    const handleShowMore = () => {
        setShowMore(!showMore)
    }
    
    const getDoctorProvince = async (province,speciality) => {
        let res = await fetchGetDoctorByProvince(province,speciality)
        if(res && res.EC === 0) {
            setListDoctor(res.DT)
        }
    }

    const handleChangeProv =  (event) => {
        let provinceID = event.target.value
        getDoctorProvince(provinceID,specialityID)
    }

    return(
        <div className='index' data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
        <Header/>    
        <div className='Detail-doctor speciality'>
            {
                specialityDetail &&
                <div className='container custom'>
                <p className='site'><NavLink to='/home'><i className="fa-solid fa-house"></i> <FormattedMessage id="header.home"/></NavLink> / <i className="fa-solid fa-star-of-life"></i> <FormattedMessage id="header.speciality"/> / {specialityDetail.name} </p>
                </div> 
            }
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        {
                            specialityDetail ?
                            <div className='speciality-info'>
                            <h4><FormattedMessage id="slides.speciality"/> {specialityDetail.name}</h4>
                            <p><FormattedMessage id="Speciality.info"/></p>
                            {
                                showMore === false ?
                                <>
                                <div dangerouslySetInnerHTML={{__html: specialityDetail.descriptionHTML}}>
                                </div>
                                <button onClick={()=>handleShowMore()}><i className="fa-solid fa-eye-slash"></i> <FormattedMessage id="common.hide detail"/></button>
                                </>
                                :
                                <button onClick={()=>handleShowMore()}><i className="fa-solid fa-eye"></i> <FormattedMessage id="common.detail"/></button>
                            }
                            </div>
                            :
                            <></>
                        }
                        <select className="form-select w-auto mb-3" onChange={(event)=>handleChangeProv(event)}>
                            <option value="0">{props.lang === Languages.VI ? "Tất cả" : "All"}</option>
                            {
                                listProv && listProv.length > 0 &&
                                listProv.map((item,index)=>{
                                    return (
                                        <option key={index} value={item.id}>{props.lang === Languages.VI ? item.valueVI : item.valueEN}</option>
                                    )
                                })
                            }          
                        </select>
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
        </div>
        <Footer/>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        theme:state.app.theme,
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
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpeciality);
