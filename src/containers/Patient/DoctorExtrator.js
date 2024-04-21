import Header from "../Home/header";
import { Component, useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import './DoctorSchedule.scss';
import React from 'react';
import { Languages } from "../../utils/constant";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { fetchGetPrice } from "../../services/doctorService";
import { NumericFormat } from 'react-number-format';

const DoctorExtrator = (props) => {
    const [data,setData] = useState({})
    const [showMore,setShowMore] = useState(true)
    const handleShowMore = () => {
        setShowMore(!showMore)
    }

    const getPrice = async (doctorId) => {
        let res = await fetchGetPrice(doctorId)
        if(res && res.EC === 0) {
            setData(res.DT)
        }
    }

    useEffect(()=>{
        if(props.doctorId)
        {
            getPrice(props.doctorId)
        }
    },[props.doctorId])

    return (
        <>
            <div className="doc-info">
                <>
                    <p><FormattedMessage id="Doctor-info.clinic"/>: <span>{data && data.Clinic && data.Clinic.name}</span></p>  
                    <p><FormattedMessage id="Doctor-info.address"/>: <span>{data && data.Clinic && data.Clinic.address}</span></p>
                    {
                        showMore === true ?
                        <p><FormattedMessage id="Doctor-info.price"/>: <span>{props.lang === Languages.VI ? 
                        <NumericFormat displayType="text" value={data && data.Price && data.Price.valueVI} allowLeadingZeros thousandSeparator=","  suffix={' VNĐ'}  />              
                        : 
                        <NumericFormat displayType="text" value={data && data.Price &&  data.Price.valueEN} allowLeadingZeros thousandSeparator="," suffix={' USD'}  />              
                        }</span>
                        <button onClick={()=>handleShowMore()}>(<FormattedMessage id="common.detail"/>)</button></p>
                        :
                        <>
                        <p><FormattedMessage id="Doctor-info.price"/>:</p>
                        <div className="info-wrap">
                        <div className="info-box d-flex align-items-center justify-content-between">
                        <p className="info-cost"><FormattedMessage id="Doctor-info.price-law"/>:</p>
                        <p className="info-price"><span>{props.lang === Languages.VI ? 
                        <NumericFormat displayType="text" value={data && data.Price &&  data.Price.valueVI} allowLeadingZeros thousandSeparator="," suffix={' VNĐ'}  />              
                        : 
                        <NumericFormat displayType="text" value={data && data.Price &&  data.Price.valueEN} allowLeadingZeros thousandSeparator="," suffix={' USD'}  />              
                        }</span></p>
                        </div>
                        <div className="info-box d-flex align-items-center justify-content-between">
                        <p className="info-pay"><FormattedMessage id="Doctor-info.method"/>:</p>
                        <p className="info-method"><span>{props.lang === Languages.VI ? data && data.Payment &&  data.Payment.valueVI : data && data.Payment &&  data.Payment.valueEN}</span></p>
                        </div>
                        </div>
                        <p><button onClick={()=>handleShowMore()}>(<FormattedMessage id="common.hide detail"/>)</button></p>
                        </>
                    }
                </>
            </div> 
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtrator);