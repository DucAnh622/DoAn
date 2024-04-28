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
import './Modal.scss';
import { Themes } from "../../utils";
import { Lightbox } from "react-modal-image";
import { Buffer } from 'buffer';

const DetailBooking = (props) => {

    const [dataSubmit,setData] = useState({})
    const [show,setShow] = useState(false)
    const [preview,setPreview] = useState("")

    useEffect(()=>{
        if(props.dataDetail && props.dataDetail.result) {
            let imageURL = ""
            imageURL = new Buffer(props.dataDetail.result,'base64').toString('binary')
            setPreview(imageURL)
        }
        setData({...props.dataDetail,LangType: props.lang, timeData: props.dataDetail.Time && props.dataDetail.Time.timeType})
    },[props.dataDetail])

    const handleCloseModal = () => {
        props.handleClose()
        console.log("check",dataSubmit)
    }
    
    return(
        <>
        <Modal show={props.showDetail} data-theme={props.dataTheme === Themes.Li ? Themes.Li : Themes.Da} onHide={()=>handleCloseModal()} centered>
            <Modal.Header>
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
                    dataSubmit.statusId === 3 &&
                    <div className='result'>
                        <label className='text-justify'><FormattedMessage id="system.user-manage.result"/>:</label> <img onClick={dataSubmit.result ? ()=>setShow(true) : () => {}} src={preview}/>
                        {
                            show === true &&
                            <Lightbox medium={preview} onClose={() => setShow(false)}/>
                        }
                    </div> 
                }
                {
                    dataSubmit.statusId === 4 &&
                    <div><label className='text-justify'><FormattedMessage id="system.product-manage.Cancel reason"/>:</label> <b>{dataSubmit.cancel}</b></div>
                }
                {
                    dataSubmit.statusId === 3 && dataSubmit.comment &&
                    <div className='mt-2'><label className='text-justify'><FormattedMessage id="Dashboard.Staff.comment"/>:</label> <b>{dataSubmit.comment}</b></div>
                }
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={()=>handleCloseModal()}>
                <FormattedMessage id="common.close"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailBooking);