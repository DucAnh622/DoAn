import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage } from "../../../store/actions/appActions";
import Slider from "react-slick";
import './speciality.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import sp1 from '../../../assets/images/speciality1.jpg';

const Handbook = (props) => {
    let settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
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
    const slider = React.useRef(null);  
    return(
        <div className="slides hospital">
            <div className="container">
                <div className='d-flex justify-content-between align-items-center'>
                    <h4><FormattedMessage id="header.handbook"/></h4>
                    <Link to="#" className="More-even"><FormattedMessage id="slides.allcontent"/></Link>
                </div>
                <div className='list-slide'>
                    <Slider ref={slider} {...settings}>
                        <Link to="#" className='item-slide item-handbook'>
                            <div className='life-img'>
                                <img src={sp1} />
                            </div>
                            <div className='life-text'>
                                <h4><FormattedMessage id="speciality.bone"/></h4>
                            </div>
                        </Link>
                        <Link to="#" className='item-slide item-handbook'>
                            <div className='life-img'>
                                <img src={sp1} />
                            </div>
                            <div className='life-text'>
                                <h4><FormattedMessage id="speciality.bone"/></h4>
                            </div>
                        </Link>
                        <Link to="#" className='item-slide item-handbook'>
                            <div className='life-img'>
                                <img src={sp1} />
                            </div>
                            <div className='life-text'>
                                <h4><FormattedMessage id="speciality.bone"/></h4>
                            </div>
                        </Link>
                        <Link to="#" className='item-slide item-handbook'>
                            <div className='life-img'>
                                <img src={sp1} />
                            </div>
                            <div className='life-text'>
                                <h4><FormattedMessage id="speciality.bone"/></h4>
                            </div>
                        </Link>
                        <Link to="#" className='item-slide item-handbook'>
                            <div className='life-img'>
                                <img src={sp1} />
                            </div>
                            <div className='life-text'>
                                <h4><FormattedMessage id="speciality.bone"/></h4>
                            </div>
                        </Link>
                        <Link to="#" className='item-slide item-handbook'>
                            <div className='life-img'>
                                <img src={sp1} />
                            </div>
                            <div className='life-text'>
                                <h4><FormattedMessage id="speciality.bone"/></h4>
                            </div>
                        </Link>
                        <Link to="#" className='item-slide item-handbook'>
                            <div className='life-img'>
                                <img src={sp1} />
                            </div>
                            <div className='life-text'>
                                <h4><FormattedMessage id="speciality.bone"/></h4>
                            </div>
                        </Link>
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
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Handbook);