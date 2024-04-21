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
import { fetchGetAllClinic, fetchGetClinicByAddress } from '../../services/clinicService';
import Header from '../Home/header';
import Footer from '../Home/footer';
import ReactPaginate from 'react-paginate';

const AllHospital = (props) => {
    const history = useHistory()
    const [listClinic,setListClinic] = useState([])
    const [totalPages,setTotalPages] = useState(0)
    const [limit,setLimit] = useState(10)
    const [page,setPage] = useState(1)
    const [listProv,setListProv] = useState([])
    const [isloading,setLoading] = useState(true)

    const getList = async () => {
        let resCli = await fetchGetAllClinic(limit,page)
        if(resCli && resCli.EC === 0) {
            setListClinic(resCli.DT.data)
            setTotalPages(resCli.DT.totalPages)
            setLoading(false)
        }
    }
    
    const handleCli = (hospital) => {
        history.push(`/clinic-detail/${hospital.id}`)
    }

    const getListProv = () => {
        props.reduxFetchDoctorRequired()
    }

    useEffect(()=> {
        setListProv(props.reduxDoctorRequired.ProRes)
    },[props.reduxDoctorRequired.ProRes])

    useEffect(()=>{
        getList()
        getListProv()
    },[page])

    const handleChangeProv = async (event) => {
        if(event.target.value !== "All") {
            let res = await fetchGetClinicByAddress(event.target.value,limit,page)
            if(res && res.EC === 0) {
                setListClinic(res.DT.data)
                setTotalPages(res.DT.totalPages)
            }
        }
        else {
            await getList()
        }
    }

    const handlePageClick = (event) => {
        setPage(+event.selected+1)
    }

    return(
        <div className='index' data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
            <Header/>    
                <div className='Detail-doctor' >
                <div className='container custom'>
                <p className='site'><NavLink to='/home'><i className="fa-solid fa-house"></i> <FormattedMessage id="header.home"/></NavLink> / <i className="fa-solid fa-hospital"></i> <FormattedMessage id="header.health-facility"/></p>
                </div>
                {
                    isloading === true ?
                    <div className='circle-loading'>
                    </div>
                    :
                    <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h4><FormattedMessage id="slides.hospital"/></h4>
                            <select className="form-select w-auto m-2" onChange={(event)=>handleChangeProv(event)}>
                            <option value="All" >{props.lang === Languages.VI ? "Tất cả" : "All" }</option>
                                {
                                    listProv && listProv.length > 0 &&
                                    listProv.map((item,index)=>{
                                        return (
                                            <option key={index} value={props.lang === Languages.VI ? item.valueVI : item.valueEN}>{props.lang === Languages.VI ? item.valueVI : item.valueEN}</option>
                                        )
                                    })
                                }          
                            </select>
                        </div>
                        </div>
                        {
                            listClinic && listClinic.length > 0 &&
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
        reduxDoctorRequired: state.admin.infoDoctor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme)),
        reduxFetchDoctorRequired: () => dispatch(actions.fetchDoctorRequiredStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllHospital);