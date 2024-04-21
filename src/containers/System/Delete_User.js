import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Languages } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";

const Delete_User = (props) => {
    return (
        <>
        <Modal show={props.showDelete} data-theme="Li" onHide={props.handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>
                <FormattedMessage id="common.confirm"/>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body><FormattedMessage id="common.confirm-delete"/> {props.dataDelete.fullName} ?</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                <FormattedMessage id="common.close"/>
            </Button>
            <Button variant="danger" onClick={props.deleteUser}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Delete_User);