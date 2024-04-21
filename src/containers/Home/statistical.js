import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage } from "../../store/actions/appActions";
import React from 'react';
import logo  from '../../assets/images/logo.png';
import '../Home/Section/video.scss';
import CountUp from 'react-countup';
import {fetchGetTotal} from '../../services/generalService';
import { get } from 'lodash';

const Statistical = (props) => {
    const [data,setData] = useState({})

    const getTotal = async () => {
        let res = await fetchGetTotal()
        if (res && res.EC === 0) {
            setData(res.DT)
        }
    }

    useEffect(()=>{
        getTotal()
    },[])

    const [isVisible, setIsVisible] = useState(false);
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      const handleScroll = () => {
        const element = document.getElementById('counting-component');
        if (element) {
          const boundingClientRect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;
          if (boundingClientRect.top <= windowHeight * 0.5) {
            setIsVisible(true);
          }
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    useEffect(() => {
      let counter = 0;
      const interval = setInterval(() => {
        if (isVisible && counter < 100) { // Change 100 to your desired final number
          setCount(counter);
          counter += 1;
        } else {
          clearInterval(interval);
        }
      }, 50); // Change 50 to adjust the speed of counting
  
      return () => clearInterval(interval);
    }, [isVisible]);


    return(
        <div className='video hospital'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-sm-4'>
                        <div className='box-total'>
                            <i className="fa-solid fa-hospital cli"></i>
                            <div className="text">
                                <p>+<CountUp start={0} end={data && data.totalCli} duration={2.75} /></p>
                                <p><FormattedMessage id="header.health-facility"/></p>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-sm-4'>
                        <div className='box-total'>
                            <i className="fa-solid fa-star-of-life spe"></i>
                            <div className="text">
                                <p>+<CountUp start={0} end={data.totalSpe} duration={2.75}/></p>
                                <p><FormattedMessage id="header.speciality"/></p>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-sm-4'>
                        <div className='box-total'>
                            <i className="fa-solid fa-briefcase-medical doc"></i>
                            <div className="text">
                                <p>+<CountUp start={0} end={data.totalDoc} duration={2.75}/></p>
                                <p><FormattedMessage id="header.doctor"/></p>
                            </div>
                        </div>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Statistical);