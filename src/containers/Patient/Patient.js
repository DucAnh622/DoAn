import { Component, useState, useEffect } from 'react';
import { Link, useParams, NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import './DetailDoctor.scss';
import React from 'react';
import { Languages, Themes } from "../../utils/constant";
import _ from 'lodash';
import { Lightbox } from "react-modal-image";
import { Buffer } from 'buffer';
import { toast } from 'react-toastify';
import { CommonUtils } from "../../utils";
import { fetchUserDetail, fetchUpdateUser } from "../../services/userService";
import Header from '../Home/header';
import Footer from '../Home/footer';
const Patient = (props) => {
    const { userId } = useParams();
    const dataDefault = {
        fullName: '',
        genderId: '',
        phone: '',
        address: '',
        email: '',
        image: ''
    }

    const defaultCheck = {
        fullName: true,
        genderId: true,
        phone: true,
        address: true,
        email: true,
        roleId: true,
        positionId: true,
        image: true
    }

    const [userData,setUserData] = useState(dataDefault)
    const [checkInput,setCheckInput] = useState(defaultCheck)
    const [listGender,setListGender] = useState([])
    const [preview,setPreview] = useState("")
    const [show,setShow] = useState(false)

    const getDetailUser = async () => {
        let res = await fetchUserDetail(userId)
        if(res && res.EC === 0) {
            let imageURL = ''
            if(res.DT.image) {
                imageURL = new Buffer(res.DT.image,'base64').toString('binary')
                setUserData({...res.DT, image: imageURL})
                setPreview(imageURL)
            }
            else {
                setUserData(res.DT)
            }
        }
    } 

    const fetchRedux = () => {
        props.reduxFetchGender()
    }

    useEffect(()=>{
        fetchRedux()
        getDetailUser()
    },[])
    
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

        let arr = ['fullName','genderId','phone','address','email']
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

        if(userData.password && userData.password.length < 3) {
            check = false
            toast.error(props.lang === Languages.VI ? 'Mật khẩu tối thiểu 3 kí tự!' : 'Password must be longer than 3!')
            setCheckInput({...checkInput,password:false})
        }

        let regex = /\S+@\S+\.\S+/

        if (userData.email && !regex.test(userData.email)) {
            toast.error(props.lang === Languages.VI ? 'Sai định dạng email!' : 'The wrong email!')
            check = false
            setCheckInput({...checkInput,email:false})
        }

        return check
    }

    const handleCancel = async () => {
        getDetailUser()
    }

    const handleUpdate = async () => {
        let check = validate()
        if(check === true) {
            let newData = _.cloneDeep(userData)
            setUserData({...newData, id: userId})
            let res = await fetchUpdateUser (newData)
            if(res && res.EC === 0) {
                toast.success(res.EM)
                await getDetailUser()
                props.accountUpdateSuccess(res.DT)
            }
            else {
                toast.error(res.EM)
            }
        }
    }

    const handleChangeImg = async (event) => {
        let src = event.target.files
        let file = src[0]
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectURL = URL.createObjectURL(file)
            setPreview(objectURL)
            setUserData({...userData, image: base64})
        }
    }

    const handleChangeLanguage = (language) => {
        props.reduxChangeLanguage(language)
    }

    return(
        <div className='index' data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
        <Header/>
        <div className='Detail-doctor'>
                <div className='container custom'>
                <p className='site'><NavLink to='/home'><i className="fa-solid fa-house"></i> <FormattedMessage id="header.home"/></NavLink> / <i className="fa-solid fa-user"></i> <FormattedMessage id="header.account"/></p>
                </div>
                <div className='container'>
                    <h4><FormattedMessage id="menu.system.system-administrator.acc-manage"/></h4>
                    <div className='row'>
                        <div className="form-group col-12 col-sm-6">
                            <label className='text-justify'><FormattedMessage id="system.user-manage.fullname"/>:</label>
                            <input type="text" className={checkInput.fullName ? "form-control" : "form-control is-invalid"} id="username" placeholder="Username"  value={userData.fullName}  onChange={(event)=>handleChangeInput(event.target.value,'fullName')}/>
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <label className='text-justify'><FormattedMessage id="system.user-manage.mobile"/>:</label>
                            <input type="number" className={checkInput.phone ? "form-control" : "form-control is-invalid"} id="Phone" placeholder="Phone" value={userData.phone} onChange={(event)=>handleChangeInput(event.target.value,'phone')}/>
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <label className='text-justify'><FormattedMessage id="system.user-manage.gender"/>:</label>
                            <select className={checkInput.genderId ? "form-select" : "form-select is-invalid"} id="gender" name="gender" value={userData.genderId} onChange={(event)=>handleChangeInput(event.target.value,'genderId')}>
                            <option>Choose</option>
                            {listGender && listGender.length > 0 &&
                                listGender.map((item,index)=>{
                                    return(
                                        <option key={index} value={item.id}>{props.lang === Languages.VI ? item.valueVI : item.valueEN}</option>
                                    )
                                })
                            }
                            </select>
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <label className='text-justify'><FormattedMessage id="system.user-manage.address"/>:</label>
                            <input type="text" className={checkInput.address ? "form-control" : "form-control is-invalid"} id="address" placeholder="Address"  value={userData.address} onChange={(event)=>handleChangeInput(event.target.value,'address')}/>
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <label className='text-justify'><FormattedMessage id="system.user-manage.email"/>:</label>
                            <input type="email" className={checkInput.email ? "form-control" : "form-control is-invalid"} id="email" placeholder="Email"  value={userData.email} onChange={(event)=>handleChangeInput(event.target.value,'email')}/>
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <label className='text-justify'><FormattedMessage id="system.user-manage.image"/>:</label>
                            <div className='d-flex'>
                            <span className='btn btn-success text-white'><label htmlFor="Image" className='text-justify text-white'><i className="fa-solid fa-upload"></i></label></span>    
                            <input hidden type="file" className="form-control" id="Image" placeholder="Image" onChange={(event)=>handleChangeImg(event)}/>
                            <div style={{backgroundImage: `url(${preview})`}} className='preview' onClick={preview ? ()=>setShow(true) : () => {}}>
                            {
                                show === true &&
                                <Lightbox medium={preview} onClose={() => setShow(false)}/>
                            }
                            </div>
                            </div>
                        </div>
                        <div className='form-group col-12 mt-2 mb-2'>
                            <button className="btn btn-primary" onClick={()=>handleUpdate()}>
                                <FormattedMessage id="common.edit"/>
                            </button>    
                            <button className='btn btn-danger' onClick={()=>handleCancel()}>
                                <FormattedMessage id="common.cancel"/>
                            </button>
                        </div>
                    </div>
                </div>
        </div>
        <Footer/>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        theme: state.app.theme,
        isLoggedIn: state.user.isLoggedIn,
        userRedux: state.user.userInfo,
        genderRedux: state.admin.gender,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme)),
        reduxFetchGender: ()=>dispatch(actions.fetchGenderStart()),
        reduxFetchPosition: ()=>dispatch(actions.fetchPositionStart()),
        reduxFetchRole: ()=>dispatch(actions.fetchRoleStart()),
        accountUpdateSuccess: (userData)=>dispatch(actions.accountUpdateSuccess(userData)),
        accountUpdateFail: ()=>dispatch(actions.accountUpdateFail())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Patient);