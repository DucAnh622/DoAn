import { Component, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage } from "../../../store/actions/appActions";
import * as actions from "../../../store/actions";
import Slider from "react-slick";
import './speciality.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import { Languages } from "../../../utils/constant";
import imag1 from '../../../assets/images/avatar1.jpg';
import { Buffer } from 'buffer';
import { useHistory } from 'react-router-dom';

const Doctor = (props) => {
    const history = useHistory()

    const [listDoctor, setListDoctor] = useState([])

    const fetchRedux = () => {
        props.reduxFetchDoctor()
    }

    const getDoctor = () => {
        setListDoctor(props.reduxDoctor)
    }

    useEffect(() => {
        fetchRedux()
    }, [])

    useEffect(() => {
        getDoctor()
    }, [props.reduxDoctor])

    const slider = React.useRef(null);

    const handleDetailDoctor = (doctor) => {
        history.push(`/doctor-detail/${doctor.id}`)
    }

    return (
        <div className="slides">
            <div className="container">
                <div className='d-flex justify-content-between align-items-center'>
                    <h4><FormattedMessage id="slides.doctor" /></h4>
                    <Link to='/doctors' className="More"><FormattedMessage id="slides.more" /></Link>
                </div>
                <div className='list-slide list-doctor'>
                    <Slider ref={slider} {...props.setting}>
                        {listDoctor && listDoctor.length > 0 &&
                            listDoctor.map((item, index) => {
                                let nameVi = `${item.Position.valueVI} ${item.fullName}`
                                let nameEn = `${item.Position.valueEN} ${item.fullName}`
                                let imageURL = ''
                                if (item.image) {
                                    imageURL = new Buffer(item.image, 'base64').toString('binary')
                                }
                                return (
                                    <div onClick={() => handleDetailDoctor(item)} className='item-slide doctor doctor-info' key={index}>
                                        <div className='img-customize'>
                                            <img src={imageURL !== '' ? imageURL : 'imag1'} />
                                        </div>
                                        <div className='info'>
                                            <p>{props.lang === Languages.VI ? nameVi : nameEn}</p>
                                            <span>{item?.Doctor_Infor.Speciality.name ? item.Doctor_Infor.Speciality.name : <FormattedMessage id="header.speciality" />}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Slider>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
        reduxDoctor: state.admin.doctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxFetchDoctor: () => dispatch(actions.fetchDoctor())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);