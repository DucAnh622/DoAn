import { Component, useState, useEffect } from 'react';
import { Link, useParams, useHistory, NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import '../Patient/DetailDoctor.scss';
import React from 'react';
import { Languages, Themes } from "../../utils/constant";
import _ from 'lodash';
import { Lightbox } from "react-modal-image";
import { Buffer } from 'buffer';
import { toast } from 'react-toastify';
import { CommonUtils } from "../../utils";
import { fetchGetAllDoctor } from '../../services/doctorService';
import Header from '../Home/header';
import Footer from '../Home/footer';
import ReactPaginate from 'react-paginate';

const AllDoctor = (props) => {
    const history = useHistory()
    const [listDoctor,setListDoctor] = useState([])
    const [totalPages,setTotalPages] = useState(0)
    const [limit,setLimit] = useState(10)
    const [page,setPage] = useState(1)
    const [isloading,setLoading] = useState(true)

    const getList = async () => {
        let resDoc = await fetchGetAllDoctor(limit,page)
        if(resDoc && resDoc.EC === 0) {
            setListDoctor(resDoc.DT.data)
            setTotalPages(resDoc.DT.totalPages)
            setLoading(false)
        }
    }

    const handlePageClick = (event) => {
        setPage(+event.selected+1)
    }

    useEffect(()=>{
        getList()
    },[page])

    const handleDoc = (doctor) => {
        history.push(`/doctor-detail/${doctor.id}`)
    }

    return(
        <div className='index' data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
            <Header/>    
                <div className='Detail-doctor'>
                <div className='container custom'>
                <p className='site'><NavLink to='/home'><i className="fa-solid fa-house"></i> <FormattedMessage id="header.home"/></NavLink> / <i className="fa-solid fa-stethoscope"></i> <FormattedMessage id="header.doctor"/></p>
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
                        {totalPages > 1 &&
                        <div className='pagination mt-3'>
                            <ReactPaginate
                            nextLabel={<i className="fa-solid fa-chevron-right"></i>}
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={totalPages}
                            previousLabel={<i className="fa-solid fa-chevron-left"></i>}
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                        />
                        </div>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(AllDoctor);