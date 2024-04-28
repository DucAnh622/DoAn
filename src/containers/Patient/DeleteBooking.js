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
import { Themes } from "../../utils";
import {fetchCancel} from '../../services/patientService'
import './Modal.scss';
const DeleteBooking = (props) => {

    const dataDefault = {
        Delete: ''
    }

    const [dataSubmit,setData] = useState(dataDefault)
    const [check,setCheck] = useState(true)

    useEffect(()=>{
        setData({...props.dataCancel,LangType: props.lang,timeData: props.dataCancel.Time && props.dataCancel.Time.timeType})
    },[props.dataCancel])

    const handleCloseModal = () => {
        props.handleClose()
        setCheck(true)
        setData(dataDefault)
    }

    const handleConfirm = async () => {
        if(!dataSubmit.Delete) {
            setCheck(false)
            props.lang === Languages.VI ? toast.error("Bạn phải điền đầy đủ thông tin!") : toast.error("Invalid input!")
        }
        else {
            let res = await fetchCancel(dataSubmit) 
            if(res && res.EC === 0) {
               props.lang === Languages.VI ? toast.success(res.EM1) : toast.success(res.EM2)
            }
            else {
               props.lang === Languages.VI ? toast.error(res.EM1) : toast.error(res.EM2)
            }
            await props.getBookingList()
            handleCloseModal()
        }       
    }

    const handleChange = (event) => {
        setData({...dataSubmit,Delete:event.target.value})
        setCheck(true)
    }

    return(
        <>
        <Modal show={props.showCancel} data-theme={props.dataTheme === Themes.Li ? Themes.Li : Themes.Da} onHide={()=>handleCloseModal()} centered>
            <Modal.Header>
            <Modal.Title><FormattedMessage id="system.product-manage.sure-delete-book"/> ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='row'>
                    <div className='form-group col-12'>
                        <textarea rows="3" onChange={(event)=>handleChange(event)} value={dataSubmit.Delete} type="text" className={check === true ? "form-control" : 'form-control is-invalid'} id="cancel" placeholder={props.lang === Languages.VI ? "Lí do hủy" : "Cancel reason"} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={()=>handleCloseModal()}>
                <FormattedMessage id="common.close"/>
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
        lang: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteBooking);