import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Languages } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";
import {fetchDeleteSpeciality} from "../../services/specialityService"
import {fetchDeleteClinic} from "../../services/clinicService"

const Delete_Hos_Spe = (props) => {

    const [Data,setData] = useState({})

    useEffect(()=>{
        setData(props.data)
    },[props.data])

    const submitDelete = async () => {
        if(Data.type === "Cli") {
            let res = await fetchDeleteClinic(Data)
            if(res && res.EC === 0) {
                toast.success(props.lang === Languages.VI ? res.EM1 : res.EM2)
            }
            else {
                toast.error(props.lang === Languages.VI ? res.EM1 : res.EM2)
            }
            props.fetchListCli()
        }
        else if (Data.type === "Spe") {
           let res = await fetchDeleteSpeciality(Data)
           if(res && res.EC === 0) {
              toast.success(props.lang === Languages.VI ? res.EM1 : res.EM2)
           }
           else {
               toast.error(props.lang === Languages.VI ? res.EM1 : res.EM2)
           }
           props.fetchListSpe()
        }
        props.handleCancel()
    }

    return (
        <>
        <Modal show={props.showDelete} data-theme="Li" onHide={props.handleCancel}>
            <Modal.Header closeButton>
            <Modal.Title>
                <FormattedMessage id="common.confirm"/>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body><FormattedMessage id="common.confirm-delete"/> {Data.type === "Cli" ? Data.nameClinic : Data.speciality } ?</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={props.handleCancel}>
                <FormattedMessage id="common.close"/>
            </Button>
            <Button variant="danger" onClick={()=>submitDelete()}>
                <FormattedMessage id="common.delete"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Delete_Hos_Spe);