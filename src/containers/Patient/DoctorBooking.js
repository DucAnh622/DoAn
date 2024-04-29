import './DoctorBooking.scss';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Component, useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import React from 'react';
import { Languages, Themes } from "../../utils/constant";
import { NumericFormat } from 'react-number-format';
import _ from 'lodash';
import { fetchGetDoctorInfo } from '../../services/doctorService';
import { fetchBook } from '../../services/patientService';
import './Modal.scss';

const DoctorBooking = (props) => {
    const [type,setType] = useState("YOU")
    const dataDefault = {
        fullName: props.userRedux ? props.userRedux.fullName : '',
        userId: props.userRedux ? props.userRedux.id : '',
        genderId: '',
        patientName: '',
        doctorId: '',
        LangType: '',
        doctorName: '',
        date: '',
        timeData: '',
        timeId: '',
        reason: ''
    }

    const defaultCheck = {
        fullName: true,
        genderId: true,
        patientName: true,
        reason: true
    }

    const [infoDr,setInfoDr] = useState()

    const [listGender,setListGender] = useState([])
    const [userData,setUserData] = useState(dataDefault)
    const [checkInput,setCheckInput] = useState(defaultCheck)

    const fetchRedux = () => {
        props.reduxFetchGender()
    }

    const getInfoDr = async (doctorId) => {
        let res = await fetchGetDoctorInfo(doctorId)
            if(res && res.EC === 0) {
                setInfoDr(res.DT)
            }
    }

    useEffect(() => {
        if(props.dataTime && props.dataTime.doctorId) {
            getInfoDr(props.dataTime.doctorId)
        }
    },[props.dataTime]);

    useEffect(()=>{
        fetchRedux()
    },[])

    useEffect(()=>{
        if (props.dataTime && props.dataTime.Time) {
            setUserData({...userData,timeData: props.dataTime.Time.timeType, doctorId: props.dataTime.doctorId , date: props.dataTime.date, timeId: props.dataTime.timeId})
        }     
    },[props.dataTime])

    useEffect(()=>{
        if(infoDr) {
            setUserData({...userData,doctorName: infoDr.fullName})
        }
    },[infoDr])
    
    useEffect(()=>{
        setListGender(props.genderRedux)
    },[props.genderRedux])

    const handleChangeInput = (value,name) => {
        let _userData = _.cloneDeep(userData)
        _userData[name]= value
        setUserData(_userData)
        setCheckInput(defaultCheck)
    }

    const validate = () => {
        setCheckInput(defaultCheck)
        let check = true

        if(props.actionModalUser === "UPDATE") {
            return true
        }

        let arr = ['genderId','patientName','reason']
        for(let i = 0; i < arr.length; i++ ) {
            if(!userData[arr[i]]) {
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

    const handleCloseModal = () => {
        setUserData(dataDefault)
        props.handleClose()
    }

    const handleCreate = async () => {
        let check = validate()
        if(check) {
            let res = await fetchBook(userData)
            if(res && res.EC === 0) {
                toast.success(props.lang === Languages.VI ? res.EM2 : res.EM1)
                await props.fetchSchedule(userData.doctorId,userData.date)
            }
            else {
                toast.error(props.lang === Languages.VI ? res.EM2 : res.EM1)
            }
        }
        setUserData(dataDefault)
        props.handleClose()
    }

    useEffect(() => {
        if(props.lang) {
            setUserData({...userData, LangType: props.lang})
            if(props.userRedux) {
                if(type === "YOU") {
                    setUserData({...userData, patientName: props.userRedux.fullName,
                    genderId: props.userRedux.genderId});
                }
                if(type === "FAMILY") {
                    setUserData({...userData, patientName: "",
                    genderId: ""}); 
                }
            }
        }
    }, [props.lang,type, props.userRedux]);

    const handleRadioChange = (event) => {
        setType(event.target.value)
    }

    const formatDate = (date) => {
        if(date) {
            let datePart = date.split("-"),
            format = `${datePart[2]}/${datePart[1]}/${datePart[0]}`;
            return format;
        }
        return
    }

    return (
        <>
        <Modal show={props.showBook} data-theme={props.dataTheme === Themes.Li ? Themes.Li : Themes.Da} onHide={()=>handleCloseModal()} centered>
        <Modal.Header >
            <Modal.Title>{props.actionModalBook === "CREATE" ? <><FormattedMessage id="system.user-manage.booking-doctor"/> </> : <FormattedMessage id="system.user-manage.edit-user"/>} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className='container info-con'>
                {
                    infoDr &&
                    <div className='info-form'>
                        <div className="avatar">
                            <img src={infoDr && infoDr.image ? infoDr.image : ''} /> 
                        </div>
                        <div className="info">
                            <p><span>{props.lang === Languages.VI ? `${infoDr.Position.valueVI} ${infoDr.fullName}` : `${infoDr.Position.valueEN} ${infoDr.fullName}`}</span></p>
                            <p><i className="fa-solid fa-calendar-check"></i> <FormattedMessage id="Doctor-info.date"/>: <span>{props.dataTime && formatDate(props.dataTime.date)} </span></p>
                            <p><i className="fa-solid fa-clock"></i> <FormattedMessage id="Doctor-info.time"/>: <span>{ props.dataTime && props.dataTime.Time && props.dataTime.Time.timeType}</span></p>
                            <p><i className="fa-solid fa-money-check-dollar"></i> <FormattedMessage id="Doctor-info.price"/>: <span>{props.lang === Languages.VI ? 
                            <NumericFormat displayType="text" value={infoDr.Doctor_Infor && infoDr.Doctor_Infor.Price && infoDr.Doctor_Infor.Price.valueVI} allowLeadingZeros thousandSeparator="," suffix={' VNĐ'}  />              
                            : 
                            <NumericFormat displayType="text" value={infoDr.Doctor_Infor && infoDr.Doctor_Infor.Price && infoDr.Doctor_Infor.Price.valueEN} allowLeadingZeros thousandSeparator="," suffix={' USD'}  />              
                            }</span></p>
                        </div>
                    </div>
                }
            </div>    
            <form>
                <div className='row'>
                    <div className="form-group col-12">
                        <div className='mt-2 d-flex justify-content-between align-items-center'>
                            <label className='text-justify'><FormattedMessage id="system.user-manage.for"/>:</label>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="YOU" checked={type === 'YOU'}  onChange={(event)=>handleRadioChange(event)}/>
                                <label className="form-check-label" htmlFor="exampleRadios1">
                                    <FormattedMessage id="Booking.myself"/>
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="FAMILY" checked={type === 'FAMILY'}  onChange={(event)=>handleRadioChange(event)}/>
                                <label className="form-check-label" htmlFor="exampleRadios2">
                                    <FormattedMessage id="Booking.family"/>
                                </label>
                            </div>
                        </div>
                    </div>
                    {
                        type === "FAMILY" &&
                        <>
                        <div className="form-group col-12 col-sm-6">
                            <label className='text-justify'><FormattedMessage id="system.user-manage.patientName"/>:</label>
                            <input type="text" className={checkInput.patientName ? "form-control" : "form-control is-invalid"} id="for" placeholder={props.lang === Languages.VI ? "Đặt cho" : "Booking for"}  value={userData.patientName} onChange={(event)=>handleChangeInput(event.target.value,'patientName')}/>
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <label className='text-justify'><FormattedMessage id="system.user-manage.gender"/>:</label>
                            <select className={checkInput.genderId ? "form-select" : "form-select is-invalid"} id="gender" name="gender" value={userData.genderId} onChange={(event)=>handleChangeInput(event.target.value,'genderId')}>
                            <option>{props.lang === Languages.VI ? "Chọn" : "Choose"}</option>
                            {listGender && listGender.length > 0 &&
                                listGender.map((item,index)=>{
                                    return(
                                        <option key={index} value={item.id}>{props.lang === Languages.VI ? item.valueVI : item.valueEN}</option>
                                    )
                                })
                            }
                            </select>
                        </div>
                        </>
                    }
                    <div className="form-group col-12">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.reason"/>:</label>
                        <textarea className={checkInput.reason ? "form-control" : "form-control is-invalid"} onChange={(event)=>handleChangeInput(event.target.value,'reason')} value= {userData.reason} id="reason" placeholder={props.lang === Languages.VI ? "Lí do khám" : "Reason"} rows={2} cols={50}/>
                    </div>
                </div>
            </form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={()=>handleCloseModal()}>
                <FormattedMessage id="common.cancel"/>
            </Button>
            <Button variant="primary" onClick={()=>handleCreate()}>
                {props.actionModalBook === "CREATE" ? <FormattedMessage id="common.confirm"/> : <FormattedMessage id="common.edit"/>}
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        genderRedux: state.admin.gender,
        doctorDetail: state.admin.detailDoctor,
        userRedux: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxFetchGender: ()=>dispatch(actions.fetchGenderStart()),
        reduxGetDetailDoctor: (id) => dispatch(actions.getDetailDoctor(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorBooking);