import Header from "../Home/header";
import { Component, useState, useEffect} from 'react';
import { Link, useHistory} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import './DoctorSchedule.scss';
import React from 'react';
import { Languages } from "../../utils/constant";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { fetchGetSchedule } from "../../services/doctorService";
import DoctorBooking from "./DoctorBooking";
import { toast } from "react-toastify";
import { CommonUtils } from "../../utils";
import { result } from "lodash";

const DoctorSchedule = (props) => {
    const history = useHistory()
    const [currentDay,setCurrentDay] = useState()
    const [showBook,setShowBook] = useState(false)
    const [dataTime,setDataTime] = useState({})
    const [actionModalBook,setActionModalBook] = useState("CREATE")
    const [day,setDay] = useState([])
    const [booking,setBooking] = useState([])

    const everyDay = () => {
        let all = []
        for(let i = 0; i < 8 ; i++) {
            let object = {}
            if(props.lang === Languages.VI) {
                if(i === 0) {
                    const formattedDate = moment(new Date()).format('DD/MM')
                    const capitalizedDate = `Hôm nay - ${formattedDate}`;
                    object.label = capitalizedDate;
                }
                else {
                    const formattedDate = moment(new Date()).add(i,'days').format('dddd - DD/MM')
                    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
                    object.label = capitalizedDate;
                }
            }
            else {
                if(i === 0) {
                    const formattedDate = moment(new Date()).format('DD/MM')
                    const capitalizedDate = `Today - ${formattedDate}`;
                    object.label = capitalizedDate;
                }
                else {
                    object.label = moment(new Date()).locale('en').add(i,'days').format('dddd - DD/MM')
                }
            }
            object.value = moment(new Date()).add(i,'days').startOf('day').format('YYYY-MM-DD')
            all.push(object)
        }
        setDay(all)
    }

    const nextEveryDay = () => {
        let all = []
        for(let i = 1; i < 9; i++) {
            let object = {}
            if(props.lang === Languages.VI) {
                const formattedDate = moment(new Date()).add(i,'days').format('dddd - DD/MM')
                const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
                object.label = capitalizedDate;
            }
            else {
                object.label = moment(new Date()).locale('en').add(i,'days').format('dddd - DD/MM')
            }
            object.value = moment(new Date()).add(i,'days').startOf('day').format('YYYY-MM-DD')
            all.push(object)
        }
        setDay(all)
    }

    const checkDay = () => {
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        if(currentHour >= 16 || (currentHour === 0 && currentMinute === 0))  {
            nextEveryDay();
        }
        else {
            everyDay();
        }
    }

    const checkTime = (time,date) => {
        const currentHour = new Date().getHours();
        const currentDay = moment(new Date()).format('YYYY-MM-DD')
        if(date === currentDay) {
            const [startHour, endMinute] = time.split("-")[0].split(":").map(Number);
            if (currentHour >= startHour && endMinute === 0) {
                return true
            } else {
                return false
            }
        }
        return false
    }

    useEffect(()=>{
        everyDay();
        checkDay();
    },[props.lang])

    useEffect(()=>{
        checkDay();
    },[])

    useEffect(() => {
        if (!currentDay) {
            if (day && day.length > 0) {
                fetchSchedule(props.doctorId, day[0].value);
            }
        }
    }, [day, props.doctorId, currentDay]);

    const fetchSchedule = async (id, date) => {
        let res = await fetchGetSchedule(id,date)
        if(res && res.EC === 0) {
            setBooking(res.DT)
        }
    }

    const handleChooseDate = async (event) => {
        if (props.doctorId) {
            setCurrentDay(event.target.value)
            fetchSchedule(props.doctorId,event.target.value)
        }
    }
 
    const handleChooseTime = (time) => {
        if(props.userInfo) {
            setShowBook(true)
            setDataTime(time)
        }
        else {
           props.lang === Languages.VI ?  toast.warning("Hãy đăng nhập trước khi đặt lịch") : toast.warning("Please login to booking!");
           history.push('/login')
        }
    }

    const handleClose = () => {
        setShowBook(false)
        setDataTime({})
    }

    return (
        <>
            <select className="form-select w-auto" onChange={(event)=>handleChooseDate(event)}>
                {
                    day && day.length > 0 &&
                    day.map((item,index)=>{
                        return (
                            <option key={index} value={item.value}>{item.label}</option>
                        )
                    })
                }          
            </select>
            <p className="title-text"><i className="fa-regular fa-calendar-days"></i> <FormattedMessage id="system.product-manage.book-schedule"/></p>
            {
                booking && booking.length > 0 ?
                <>
                <div className="d-flex d-grid gap-2 flex-wrap mt-2">
                {booking.map((item, index) =>{
                    let type = checkTime(item.Time && item.Time.timeType,item.date)
                    if (item.check === false && type === false) {
                        return (
                            <button onClick={()=>handleChooseTime(item)} className="btn btn-time d-block" key={index}>
                                {item.Time && item.Time.timeType}
                            </button>
                        )
                    }
                })}
                </div>
                <p className="egg"><FormattedMessage id="common.choose"/> <FormattedMessage id="common.and-book"/></p>
                </>
                :
                <p><FormattedMessage id="system.product-manage.not-schedule"/>!</p>
            }
            <DoctorBooking
                showBook={showBook} 
                handleClose={handleClose}
                dataTime={dataTime}
                dataTheme = {props.theme}
                fetchSchedule={fetchSchedule}
                actionModalBook={actionModalBook}  
            /> 
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        userInfo: state.user.userInfo,
        theme: state.app.theme,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);