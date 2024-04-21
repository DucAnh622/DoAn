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

const CancelBooking = (props) => {

    const [dataSubmit,setData] = useState({})

    useEffect(()=>{
        setData({...props.dataBooking,LangType: props.lang, timeData: props.dataBooking.Time && props.dataBooking.Time.timeType})
    },[props.dataBooking])

    const handleCloseModal = () => {
        props.handleClose()
    }

    const handleConfirm = async () => {
        let newData = {
            ...dataSubmit,
            email: props.dataBooking && props.dataBooking.patientData && props.dataBooking.patientData.email, 
            username: props.dataBooking && props.dataBooking.patientData && props.dataBooking.patientData.fullname,
            doctor: props.dataBooking && props.dataBooking.doctorDataBooking.fullname
        }
        props.setActive(true)
        props.handleClose()
        await props.submitCancel(newData)
    }

    return(
        <>
        <Modal show={props.showCancel} data-theme="Li" onHide={()=>handleCloseModal()} centered>
            <Modal.Header closeButton>
            <Modal.Title><FormattedMessage id="system.product-manage.Cancel book"/></Modal.Title>
            </Modal.Header>
            <Modal.Body><FormattedMessage id="system.product-manage.cancel"/> {props.dataBooking && props.dataBooking.patientData && props.dataBooking.patientData.fullname}  ?</Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={()=>handleCloseModal()}>
                <FormattedMessage id="common.cancel"/>
            </Button>
            <Button variant="primary" onClick={()=>handleConfirm()}>
                <FormattedMessage id="system.product-manage.confirm"/>
            </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(CancelBooking);