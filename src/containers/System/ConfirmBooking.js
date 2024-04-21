import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Languages } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";
import _ from 'lodash';
import { CommonUtils } from "../../utils";

const ConfirmBooking = (props) => {

    const [dataSubmit,setData] = useState({})

    useEffect(()=>{
        setData({...props.dataBooking,LangType: props.lang, timeData: props.dataBooking.Time && props.dataBooking.Time.timeType})
    },[props.dataBooking])

    const handleCloseModal = () => {
        props.handleClose()
    }
    
    const handleConfirm = async () => {
        props.setActive(true)
        props.handleClose()
        await props.submitConfirm(dataSubmit)
    }

    return(
        <>
        <Modal show={props.showConfirm} data-theme="Li" onHide={()=>handleCloseModal()} centered>
            <Modal.Header closeButton>
            <Modal.Title><FormattedMessage id="Dashboard.Staff.info booking"/></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div><label className='text-justify'><FormattedMessage id="system.user-manage.Booking"/>:</label> <b>{dataSubmit && dataSubmit.patientData && dataSubmit.patientData.fullname}</b></div>
                <div><label className='text-justify'><FormattedMessage id="system.user-manage.email"/>:</label> <b>{dataSubmit && dataSubmit.patientData && dataSubmit.patientData.email}</b></div>
                <div><label className='text-justify'><FormattedMessage id="system.user-manage.patientName"/>:</label> <b>{dataSubmit.patientName}</b></div>
                <div><label className='text-justify'><FormattedMessage id="system.user-manage.gender"/>:</label> <b>{props.lang === Languages.VI ? dataSubmit && dataSubmit.Gender && dataSubmit.Gender.valueVI  :dataSubmit && dataSubmit.Gender && dataSubmit.Gender.valueEN}</b></div>
                <div><label className='text-justify'><FormattedMessage id="system.user-manage.mobile"/>:</label> <b>{dataSubmit && dataSubmit.patientData && dataSubmit.patientData.phone}</b></div>
                <div><label className='text-justify'><FormattedMessage id="system.user-manage.address"/>:</label> <b>{dataSubmit && dataSubmit.patientData && dataSubmit.patientData.address}</b></div>
                <div><label className='text-justify'><FormattedMessage id="system.user-manage.reason"/>:</label> <b>{dataSubmit.reason}</b></div>
                {
                    dataSubmit.statusId === 4 &&
                    <div><label className='text-justify'><FormattedMessage id="system.product-manage.Cancel reason"/>:</label> <b>{dataSubmit.cancel}</b></div>
                }
                {
                    dataSubmit.statusId === 3 && dataSubmit.comment &&
                    <div><label className='text-justify'><FormattedMessage id="Dashboard.Staff.comment"/>:</label> <b>{dataSubmit.comment}</b></div>
                }
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={()=>handleCloseModal()}>
                <FormattedMessage id="common.close"/>
            </Button>
            {
                dataSubmit.statusId === 1 &&
                <Button variant="primary" onClick={()=>handleConfirm()}>
                <FormattedMessage id="system.product-manage.confirm"/>
                </Button>
            }
            </Modal.Footer>
        </Modal>
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmBooking);