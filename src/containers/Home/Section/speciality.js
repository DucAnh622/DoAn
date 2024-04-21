import '../Section/speciality.scss';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage } from "../../../store/actions/appActions";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import { fetchGetSpeciality } from '../../../services/specialityService';
import { Buffer } from 'buffer';
import { useHistory } from 'react-router-dom';

const Speciality = (props) => {
    const [listSpeciality,setListSpeciality] = useState([])
    const history = useHistory()

    const getListSpeciality = async () => {
        let res = await fetchGetSpeciality(10)
        if(res && res.EC === 0) {
            setListSpeciality(res.DT)
        }
    }

    useEffect(()=>{
        getListSpeciality()
    },[])

    const handleDetailSpeciality = (speciality) => {
        history.push(`/speciality-detail/${speciality.id}`)
    }

    const slider = React.useRef(null);  
    return(
        <div className="slides">
            <div className="container">
                <div className='d-flex justify-content-between align-items-center'>
                    <h4><FormattedMessage id="slides.speciality"/></h4>
                    <Link to='/specialities' className="More"><FormattedMessage id="slides.more"/></Link>
                </div>
                <div className='list-slide'>
                    <Slider ref={slider} {...props.setting}>
                        {
                            listSpeciality && listSpeciality.length > 0 &&
                            listSpeciality.map((item,index)=> {
                                let imageURL = ''
                                if(item.image) {
                                    imageURL = new Buffer(item.image,'base64').toString('binary')
                                }
                                return(
                                    <div onClick={()=>handleDetailSpeciality(item)} className='item-slide' key={index}>
                                        <div className='box-img'><img src={imageURL} /></div>
                                        <div className='box-text'>
                                            <h4>{item.name}</h4>
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

export default connect(mapStateToProps, mapDispatchToProps)(Speciality);