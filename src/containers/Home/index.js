import Footer from "../Home/footer";
import Header from "../Home/header";
import { connect } from 'react-redux';
import './index.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { appChangeLanguage, appChangeTheme} from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import React from "react";
import Speciality from "./Section/speciality";
import Hospital from "./Section/hospital";
import Doctor from "./Section/doctor";
import Handbook from "./Section/handbook";
import Life from "./Section/life";
import Video from "./Section/video";
import Advance from "./Section/advance";
import { Themes } from "../../utils/constant";
import { useHistory } from 'react-router-dom';
import sp1 from '../../assets/images/speciality1.jpg';
import Slider from "react-slick";
import Statistical from "./statistical";

const Index = (props) => {

    const history = useHistory()
    const slider = React.useRef(null); 

    const slideBanner = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: null,
        nextArrow: null, 
    }

    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              initialSlide: 2
            }
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };

    const [setting,setSetting] = useState(settings)

    const handleOpenSearch = () => {
        history.push("/search")
    }

    return(
        <>
        <div className="index" data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
            <Header/>
            <div className="banner">
                <div className="container">
                <div className='list-slide'>
                    <Slider ref={slider} {...slideBanner}>
                        <div className='item-slide item-life'>
                            <img src="https://cdn.bookingcare.vn/fo/w1920/2023/10/10/163557-dat-lich-cham-soc-wecare247.png" />
                        </div>
                        <div className='item-slide item-life'>
                            <img src="https://cdn.bookingcare.vn/fo/w1920/2023/09/07/141422-144204-dat-lich-kham-bookingcare-pharmacity.jpg" />
                        </div>
                        <div className='item-slide item-life'>
                            <img src="https://cdn.bookingcare.vn/fo/w1920/2023/11/02/134537-group-12314.png" />
                        </div>
                    </Slider>
                </div>
                <h4><FormattedMessage id="index.banner10"/></h4>
                <div className="banner-bottom">
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <div className="banner-content-item">
                                <Link to="#">
                                <i className="fa-solid fa-hospital"></i>
                                <p><FormattedMessage id="index.banner1"/></p>
                                </Link>
                            </div>   
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="banner-content-item">
                                <Link to="#">
                                <i className="fa-solid fa-mobile"></i>
                                <p><FormattedMessage id="index.banner2"/></p>
                                </Link>
                            </div>   
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="banner-content-item">
                                <Link to="#">
                                <i className="fa-solid fa-file-signature"></i>
                                <p><FormattedMessage id="index.banner3"/></p>
                                </Link>
                            </div>   
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="banner-content-item">
                                <Link to="#">
                                <i className="fa-solid fa-microscope"></i>
                                <p><FormattedMessage id="index.banner4"/></p>
                                </Link>
                            </div>   
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="banner-content-item">
                                <Link to="#">
                                <i className="fa-solid fa-brain"></i>
                                <p><FormattedMessage id="index.banner5"/></p>
                                </Link>
                            </div>   
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="banner-content-item">
                                <Link to="#">
                                <i className="fa-solid fa-tooth"></i>
                                <p><FormattedMessage id="index.banner6"/></p>
                                </Link>
                            </div>   
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="banner-content-item">
                                <Link to="#">
                                <i className="fa-solid fa-bed-pulse"></i>
                                <p><FormattedMessage id="index.banner7"/></p>
                                </Link>
                            </div>   
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="banner-content-item">
                                <Link to="#">
                                <i className="fa-solid fa-clipboard-check"></i>
                                <p><FormattedMessage id="index.banner8"/></p>
                                </Link>
                            </div>   
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="banner-content-item">
                                <Link to="#">
                                <i className="fa-solid fa-house-medical"></i>
                                <p><FormattedMessage id="index.banner9"/></p>
                                </Link>
                            </div>   
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <Statistical/>
            <Speciality setting = {setting}/>
            <Hospital setting = {setting}/>
            <Doctor setting = {setting}/>
            <Handbook/>
            <Life/>
            <Video/>
            <Advance/>
            <Footer/>
        </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        theme: state.app.theme,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
        doctorRedux: state.admin.doctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxFetchDoctor: () => dispatch(actions.fetchDoctor()),
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
