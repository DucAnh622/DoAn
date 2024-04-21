import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage } from "../../../store/actions/appActions";
import Slider from "react-slick";
import './speciality.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchGetClinic } from '../../../services/clinicService';
import React from 'react';
import hp1 from '../../../assets/images/hospital1.jpg';
import { useHistory } from 'react-router-dom';
import { Buffer } from 'buffer';

const Hospital = (props) => {
    let settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 3,
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
    const slider = React.useRef(null); 
    
    const [listClinic,setListClinic] = useState([])
    const history = useHistory()

    const getListClinic = async () => {
        let res = await fetchGetClinic(10)
        if(res && res.EC === 0) {
            setListClinic(res.DT)
        }
    }

    useEffect(()=>{
        getListClinic()
    },[])

    const handleDetailClinic = (clinic) => {
        history.push(`/clinic-detail/${clinic.id}`)
    }

    return(
        <div className="slides hospital">
            <div className="container">
                <div className='d-flex justify-content-between align-items-center'>
                    <h4><FormattedMessage id="slides.hospital"/></h4>
                    <Link to='/hospitals' className="More-even"><FormattedMessage id="slides.more"/></Link>
                </div>
                <div className='list-slide'>
                    <Slider ref={slider} {...settings}>
                        {
                            listClinic && listClinic.length > 0 &&
                            listClinic.map((item,index)=> {
                                let imageURL = ''
                                if(item.image) {
                                    imageURL = new Buffer(item.image,'base64').toString('binary')
                                }
                                return(
                                    <div onClick={()=>handleDetailClinic(item)} className='item-slide' key={index}>
                                        <div className='box-img'><img src={imageURL} /></div>
                                        <div className='box-text'>
                                            <h4>{item.name}</h4>
                                            <p>{item.address}</p>
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
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Hospital);