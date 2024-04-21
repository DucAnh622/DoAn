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

const DoneBooking = (props) => {

    const [dataSubmit,setData] = useState({})

    useEffect(()=>{
        setData({...props.dataBooking,LangType: props.lang, timeData: props.dataBooking.Time && props.dataBooking.Time.timeType})
    },[props.dataBooking])

    const handleCloseModal = () => {
        props.handleClose()
    }

    const handleChangeImg = async (event) => {
        let src = event.target.files
        let file = src[0]
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            setData({...dataSubmit,
                file: base64
            })
        }
    }

    const handleDone = async () => {
        let newData = {
            ...dataSubmit,
            email: props.dataBooking && props.dataBooking.patientData && props.dataBooking.patientData.email, 
            username: props.dataBooking && props.dataBooking.patientData && props.dataBooking.patientData.fullname,
            doctor: props.dataBooking.doctorDataBooking && props.dataBooking.doctorDataBooking.fullname
        }
        props.setActive(true)
        props.handleClose()
        await props.submitDone(newData)
    }

    return(
        <>
        <Modal show={props.showDone} data-theme="Li" onHide={()=>handleCloseModal()} centered>
            <Modal.Header closeButton>
            <Modal.Title><FormattedMessage id="system.product-manage.bill"/></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='row'>
                    <div className="form-group col-12 col-sm-6">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.Booking"/>:</label>
                        <input type="text" className="form-control" value={props.dataBooking && props.dataBooking.patientData && props.dataBooking.patientData.fullname} id="username" placeholder="Username" />
                    </div>
                    <div className='form-group col-12 col-sm-6'>
                        <label className='text-justify'><FormattedMessage id="system.user-manage.email"/>:</label>
                        <input type="email" className="form-control" value={props.dataBooking && props.dataBooking.patientData && props.dataBooking.patientData.email} id="email" placeholder="Email" />
                    </div>
                    <div className='form-group col-12'>
                        <label className='text-justify'><FormattedMessage id="system.product-manage.result"/>:</label>
                        <input type="file" className="form-control" id="file" onChange={(event)=>handleChangeImg(event)} placeholder="File" />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={()=>handleCloseModal()}>
                <FormattedMessage id="common.cancel"/>
            </Button>
            <Button variant="primary" onClick={()=>handleDone()}>
                <FormattedMessage id="common.send"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoneBooking);