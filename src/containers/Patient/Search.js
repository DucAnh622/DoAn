import { Component, useState, useEffect } from 'react';
import { Link, useParams, useHistory, NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import './DetailDoctor.scss';
import React from 'react';
import { Languages, Themes } from "../../utils/constant";
import _ from 'lodash';
import { Lightbox } from "react-modal-image";
import { Buffer } from 'buffer';
import { toast } from 'react-toastify';
import { CommonUtils } from "../../utils";
import { fetchGetSpeciality } from '../../services/specialityService';
import { fetchGetClinic } from '../../services/clinicService';
import { fetchGetDoctor } from '../../services/doctorService';
import { fetchSearch } from '../../services/patientService';
import Header from '../Home/header';
import Footer from '../Home/footer';
const Search = (props) => {
    const history = useHistory()
    const [listDoctor,setListDoctor] = useState([])
    const [listSpeciality,setListSpeciality] = useState([])
    const [listClinic,setListClinic] = useState([])
    const [isloading,setLoading] = useState(true)

    const getList = async () => {
        let resDoc = await fetchGetDoctor()
        let resSpe = await fetchGetSpeciality()
        let resCli = await fetchGetClinic()
        if(resCli && resCli.EC === 0 && resDoc && resDoc.EC === 0 && resSpe && resSpe.EC === 0) {
            setListDoctor(resDoc.DT)
            setListSpeciality(resSpe.DT)
            setListClinic(resCli.DT)
            setLoading(false)
        }
    }

    useEffect(()=>{
        getList()
    },[])

    const dataDefault = {
        keyword: "",
        type: "ALL",
        sort: "ASC",
    }

    const [data,setData] = useState(dataDefault)

    const handleChangeLanguage = (language) => {
        props.reduxChangeLanguage(language)
    }

    const handlePressEnter = (event) => {
        if(event.charCode === 13 && event.code === 'Enter') {
            handleSearch()
        }
    }

    const handleSearch = async () => {
       if(data.keyword) {
            let res = await fetchSearch(data)
            setLoading(true)
            if(res && res.EC === 0) {
                setListDoctor(res.DT.rsDoc)
                setListSpeciality(res.DT.rsSpe)
                setListClinic(res.DT.rsCli)
                setLoading(false)
            }
       }
       else {
            getList()
       }
    }

    const handleDoc = (doctor) => {
        history.push(`/doctor-detail/${doctor.id}`)
    }

    const handleSpe = (speciality) => {
        history.push(`/speciality-detail/${speciality.id}`)
        console.log("Check ",listClinic)
    }

    const handleCli = (hospital) => {
        history.push(`/clinic-detail/${hospital.id}`)
    }

    return(
        <div className='index' data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
        <Header/>
        <div className='Detail-doctor'>
                <div className='container custom'>
                <p className='site'><NavLink to='/home'><i className="fa-solid fa-house"></i> <FormattedMessage id="header.home"/></NavLink> / <i className="fa-solid fa-magnifying-glass"></i> <FormattedMessage id="header.search"/></p>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='form-group col-12 col-sm-7 mt-3 mb-3'>
                            <input onKeyPress={(event)=>handlePressEnter(event)} className="form-control mr-sm-2" type="search" name="keyword" value={data.keyword} onChange={(event)=>setData({...data,keyword: event.target.value})} placeholder={props.lang === Languages.VI ? "Tìm kiếm" : "Search"} aria-label="Search"/>
                        </div>
                        <div className='form-group col-12 col-sm-2 mt-3 mb-3'>
                            <select className="form-select" value={data.type} onChange={(event)=>setData({...data,type: event.target.value})} id="type" name="type">
                                {
                                    props.lang === Languages.VI ?
                                    <>
                                    <option value="ALL">Tất cả</option>
                                    <option value="DOC">Bác sỹ</option>
                                    <option value="SPE">Chuyên khoa</option>
                                    <option value="CLI">Cơ sở y tế</option>
                                    </>
                                    :
                                    <>
                                    <option value="ALL">All</option>
                                    <option value="DOC">Doctor</option>
                                    <option value="SPE">Speciality</option>
                                    <option value="CLI">Hospital</option>
                                    </>
                                }
                            </select>
                        </div>
                        <div className='form-group col-12 col-sm-2 mt-3 mb-3'>
                            <select className="form-select" value={data.sort} onChange={(event)=>setData({...data,sort: event.target.value})} id="sort" name="sort">
                                {
                                    props.lang === Languages.VI ?
                                    <>
                                    <option value="ASC">Tăng dần</option>
                                    <option value="DESC">Giảm dần</option>
                                    </>
                                    :
                                    <>
                                    <option value="ASC">Asc</option>
                                    <option value="DESC">Desc</option>
                                    </>
                                }
                            </select>
                        </div>
                        <div className='form-group col-12 col-sm-1 mt-3 mb-3'>
                            <button className="btn btn-success text-white w-100" type="submit" onClick={()=>handleSearch()}><i className="fa-solid fa-magnifying-glass"></i></button>
                        </div>
                    </div>
                </div>
                {
                    isloading === true ?
                    <div className='circle-loading'>
                    </div>
                    :
                    <>
                    {
                    listDoctor && listDoctor.length > 0 ?
                    <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                        <h4><FormattedMessage id="header.doctor"/></h4>
                        </div>
                        {
                            listDoctor.map((item,index) => {
                                let nameVi = `${item.Position.valueVI} ${item.fullName}`
                                let nameEn = `${item.Position.valueEN} ${item.fullName}`
                                let imageDoc = ''
                                if(item.image) {
                                    imageDoc = new Buffer(item.image,'base64').toString('binary')
                                }
                                return(
                                    <div onClick={()=>handleDoc(item)} className='col-12 item-search' key={index}>
                                        <img className='img-customize' src={imageDoc !== '' ? imageDoc : 'imag1'} />
                                        <div className='box-item-text'>
                                            <p>{props.lang === Languages.VI ? nameVi : nameEn }</p>
                                            <span>{item.Doctor_Infor && item.Doctor_Infor.Speciality && item.Doctor_Infor.Speciality.name ? item.Doctor_Infor.Speciality.name : <FormattedMessage id="header.speciality"/> }</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    </div>
                    :
                    <></>
                    }
                    {
                    listSpeciality && listSpeciality.length > 0 ?
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                            <h4><FormattedMessage id="header.speciality"/></h4>
                            </div>
                            {
                                
                                listSpeciality.map((item,index) => {
                                    let imageSpe = ''
                                    if(item.image) {
                                        imageSpe = new Buffer(item.image,'base64').toString('binary')
                                    }
                                    return(
                                        <div onClick={()=>handleSpe(item)} className='col-12 item-search' key={index}>
                                            <img className='img-customize' src={imageSpe !== '' ? imageSpe : 'imag1'} />
                                            <div className='box-item-text'>
                                                <p>{item.name}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <></>
                    }
                    {
                    listClinic && listClinic.length > 0 ?
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                            <h4><FormattedMessage id="header.health-facility"/></h4>
                            </div>
                            {
                                
                                listClinic.map((item,index) => {
                                    let imageCli = ""
                                    if(item.image) {
                                        imageCli = new Buffer(item.image,'base64').toString('binary')
                                    }
                                    return(
                                        <div onClick={()=>handleCli(item)} className='col-12 item-search' key={index}>
                                            <img className='img-customize' src={imageCli !== '' ? imageCli : 'imag1'} />
                                            <div className='box-item-text'>
                                                <p>{item.name}</p>
                                                <p><i className="fa-solid fa-location-dot"></i> {item.address}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <></>
                    }
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
        isLoggedIn: state.user.isLoggedIn,
        userRedux: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);