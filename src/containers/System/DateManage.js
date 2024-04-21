import React, { Component, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Select from 'react-select';
import * as actions from "../../store/actions";
import { Languages, dateFormat, roleUsers } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";
import _ from 'lodash';
import DatePicker from "react-datepicker";
import '../System/DateManage.scss';
import "react-datepicker/dist/react-datepicker.css";
import FormattedDate from '../../components/Formating';
import { toast } from 'react-toastify';
import moment from 'moment';
import Dashboard from '../System/Dashboard';

const DateManage = (props) => {
    const dataDefault = {
        doctorId: '',
        date: '',
        timeArr: [],
        roleId: props.userRedux.roleId
    }

    const defaultCheck = {
        doctorId: true,
        date: true,
        timeArr: true
    }

    const minDate = moment().startOf('day').toDate();
    const [dateData,setDateData] = useState(dataDefault)
    const [checkInput,setCheckInput] = useState(defaultCheck)
    const [schedule,setSchedule] = useState([])
    const [listDoctors,setListDoctor] = useState([])
    const fetchRedux = () => {
        props.reduxFetchSchedule()
        props.reduxFetchDoctor()
    }

    useEffect(()=>{
        fetchRedux()
    },[])
    
    useEffect(()=>{
       let data = props.reduxSchedule
       if(data && data.length > 0 ) {
           data = data.map(item => ({...item, isSelected: false}))
           setSchedule(data)
       }
       setListDoctor(getAllDoctor(props.reduxDoctor)) 
    },[props.reduxSchedule,props.reduxDoctor])

    const handleChangeInput = (value,name) => {
        let _dateData = _.cloneDeep(dateData)
        _dateData[name]= value
        setDateData(_dateData)
        setCheckInput(defaultCheck)
    }

    const getAllDoctor = (data) => {
        let result = []
        if(data && data.length > 0) {
            data.map((item,index)=> {
                let object = {}
                object.label = `${item.fullName}`
                object.value = `${item.id}`
                result.push(object)
            })
        }
        return result
    }

    const validate = () => {
        setCheckInput(defaultCheck)
        let check = true

        if(props.actionModalUser === "UPDATE") {
            return true
        }

        let arr = ['date']
        for(let i = 0; i < arr.length; i++ ) {
            if(!dateData[arr[i]]) {
                let _checkInput = _.cloneDeep(defaultCheck)
                _checkInput[arr[i]] = false
                setCheckInput(_checkInput)
                check = false
                toast.error(props.lang === Languages.VI ? 'Dữ liệu nhập trống!' : 'Invalid input!')
                break
            }
        }
        return check
    }

    const handleChooseTime = (time) => {
        if (schedule && schedule.length > 0) {
          const updatedSchedule = schedule.map((item) => {
            if (item.id === time.id) {
              return { ...item, isSelected: !item.isSelected };
            }
            return item;
          });
          setSchedule(updatedSchedule);
        }
      };

    const handleCreate = () => {
        let result = [];
        let check = validate();
        if (check === true) {
          if (dateData.date) {
            let formattedDate = moment(dateData.date).format('YYYY-MM-DD');
            if (schedule && schedule.length > 0) {
              let selectedTime = schedule.filter(item => item.isSelected === true);
              if (selectedTime && selectedTime.length > 0) {
                selectedTime.forEach(time => {
                  let newTimeData = {
                    doctorId: props.userRedux.roleId === roleUsers.ADMIN ? dateData.doctorId : props.userRedux.id,
                    date: formattedDate,
                    timeId: time.id
                  };
                  result.push(newTimeData);
                });
                let newDateData = {}
                if(dateData.roleId === roleUsers.ADMIN) {
                    newDateData = {
                        doctorId: dateData.doctorId,
                        date: formattedDate,
                        timeArr: result
                      };
                }
                else {
                    newDateData = {
                        doctorId: props.userRedux.id,
                        date: formattedDate,
                        timeArr: result
                      };
                }
                // setDateData(newDateData);
                // console.log("check data",newDateData)
                props.reduxCreateSchedule(newDateData);
              } else {
                toast.error(props.lang === Languages.VI ? 'Thời gian lỗi!' : 'Invalid time!')
              }
            }
          }
          setDateData(dataDefault);
          schedule.forEach(item => {
            item.isSelected = false;
          });
        }
      };

    const handleCancel = () => {
        setDateData(dataDefault)
        schedule.forEach(item => {
        item.isSelected = false;
        });
    }

    return (
        <>
        {
            props.userRedux && props.userRedux.roleId !== roleUsers.STAFF
            ?
            <>
            <div className='date-manage'>
                <div className='container'>
                    <h4><FormattedMessage id="menu.system.system-administrator.date-manage"/></h4>
                    <div className='row'>
                        {
                            dateData.roleId === roleUsers.ADMIN &&
                            <div className='form-group col-12 col-sm-6'>
                                <label className='text-justify'><FormattedMessage id="system.product-manage.choose-doc"/>:</label>
                                <Select className={checkInput.doctorId ? "form-control" : "form-control is-invalid"} value={dateData.doctorId ? dateData.doctorId.value : null} onChange={(selectedOption) => handleChangeInput(selectedOption.value, 'doctorId')}  options={listDoctors}/>
                            </div>
                        }
                        <div className='form-group col-12 col-sm-6'>
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-date"/>:</label>
                            <span className='form-control date-input'>
                            <DatePicker
                                className={checkInput.date ? "form-control" : "form-control is-invalid"}
                                selected={dateData.date ? moment(dateData.date).toDate() : null}
                                value={dateData.date}
                                onChange={(date) => handleChangeInput(date, 'date')}
                                minDate={minDate}
                                filterDate={(date) => date => minDate}   
                            />
                            </span>
                        </div>
                        <div className="form-group col-12 ml-2 mr-2">
                            <div className="d-flex d-grid gap-2 flex-wrap mt-2">
                                {
                                    schedule && schedule.length > 0 && 
                                    schedule.map((item, index) => {
                                        return(
                                            <button onClick={()=>handleChooseTime(item)} className={
                                                item.isSelected
                                                ? "btn btn-active d-block"
                                                : "btn d-block"
                                            } key={index}>
                                                {item.timeType}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className='form-group col-12 mt-2 mb-2'>
                            <button className="btn btn-primary" onClick={()=>handleCreate()}>
                            <FormattedMessage id="common.save"/>
                            </button>    
                            <button className='btn btn-danger btn-margin' onClick={()=>handleCancel()}>
                                <FormattedMessage id="common.cancel"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </>
            :
            <Dashboard/>
        }
        </>
    )
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
        userRedux: state.user.userInfo,
        reduxDoctor: state.admin.doctors,
        reduxSchedule: state.admin.Date
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxFetchDoctor: () => dispatch(actions.fetchDoctor()),
        reduxFetchSchedule: () => dispatch(actions.fetchScheduleStart()),
        reduxCreateSchedule: (data) => dispatch(actions.createSchedule(data)) 
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DateManage);