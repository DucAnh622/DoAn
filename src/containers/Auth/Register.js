import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Register.scss';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import logo  from '../../assets/images/logo.png';
import { Languages, Themes } from "../../utils/constant";
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import { fetchRegister, fetchCreateUser, fetchUpdateUser} from '../../services/userService';
import { fetchGender} from '../../services/generalService';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom';

const Register = (props) => {

    const history = useHistory()

    const dataDefault = {
        fullName: '',
        genderId: '',
        phone: '',
        address: '',
        email: '',
        password: ''
    }

    const defaultCheck = {
        fullName: true,
        genderId: true,
        phone: true,
        address: true,
        email: true,
        password: true
    }

    const [userData,setUserData] = useState(dataDefault)
    const [checkInput,setCheckInput] = useState(defaultCheck)
    
    const handleChangeInput = (value,name) => {
        let _userData = _.cloneDeep(userData)
        _userData[name]= value
        setUserData(_userData)
        setCheckInput(defaultCheck)
    }

    const validate = () => {
        setCheckInput(defaultCheck)
        let check = true

        let arr = ['fullName','genderId','phone','address','email','password']
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

    const [listGender,setListGender] = useState([])
    
    const getGender = async()=> {
        let response = await fetchGender()
        if(response && response.EC === 0) {
            setListGender(response.DT)
        }
    }

    useEffect(()=>{
        getGender()
    },[])
    
    const handleChangeLanguage = (language) => {
        props.reduxChangeLanguage(language)
    }

    const handleChangeTheme = (theme) => {
        props.reduxChangeTheme(theme)
    }

    const handleRegister = async () => {
        let check = validate()
        if(check === true) {
            let res = await fetchRegister(userData)
            if(res && res.EC === 0) {
                history.push('/login')
                toast.success(props.lang === Languages.VI ? res.EM2 : res.EM1)
            }
            else {
                toast.error(props.lang === Languages.VI ? res.EM2 : res.EM1)
            }
        }
        setUserData(dataDefault)
    }

    const handlePressEnter = (event) => {
        if(event.charCode === 13 && event.code === 'Enter') {
            this.handleLogin()
        }
    }

    return (
        <>
        <div className='background d-flex align-item-center justify-content-center' data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
            <div className='container register-form'>
                <div className='form-group'>
                    <Link to={'/home'}><img src={logo} alt='logo'/></Link>
                </div> 
                <div className='row'>
                    <div className="form-group col-12 col-sm-6">
                        <input type="text" className={checkInput.fullName ? "form-control" : "form-control invalid "} id="username" placeholder={props.lang === Languages.VI ? "Tên tài khoản" : "Username"}  value={userData.fullName}  onChange={(event)=>handleChangeInput(event.target.value,'fullName')}/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <input type="number" className={checkInput.phone ? "form-control" : "form-control invalid "} id="Phone" placeholder={props.lang === Languages.VI ? "Điện thoại" : "Phone"}  value={userData.phone} onChange={(event)=>handleChangeInput(event.target.value,'phone')}/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <select className={checkInput.genderId ? "form-select" : "form-select invalid "} id="gender" name="gender" value={userData.genderId} onChange={(event)=>handleChangeInput(event.target.value,'genderId')}>
                        <option>{props.lang === Languages.VI ? "Giới tính" : "Gender"} </option>
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
                        <input type="text" className={checkInput.address ? "form-control" : "form-control invalid "} id="address" placeholder={props.lang === Languages.VI ? "Địa chỉ" : "Address"}   value={userData.address} onChange={(event)=>handleChangeInput(event.target.value,'address')}/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <input type="email" className={checkInput.email ? "form-control" : "form-control invalid "} id="email" placeholder="Email"  value={userData.email} onChange={(event)=>handleChangeInput(event.target.value,'email')}/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <input onKeyPress={(event)=>handlePressEnter(event)} type="password" className={checkInput.password ? "form-control" : "form-control invalid "} id="password" placeholder={props.lang === Languages.VI ? "Mật khẩu" : "Password"}  value={userData.password} onChange={(event)=>handleChangeInput(event.target.value,'password')}/>
                    </div>
                    <div className='form-group col-12 mt-3'>
                        <button onClick={()=>handleRegister()} type='button' className="submit w-100"><FormattedMessage id="login.signup"/></button>
                        <p><FormattedMessage id="login.have"/> <span><Link to={'/login'}><FormattedMessage id="login.login"/></Link></span></p>
                    </div>
                </div>
            </div>
            <div className='setting'>
                <ul>
                    {
                        props.theme === Themes.Li ?
                        <li>
                            <span onClick={()=>handleChangeTheme(Themes.Da)}><i className="fa-solid fa-moon"></i></span>
                        </li>
                        :
                        <li>
                            <span onClick={()=>handleChangeTheme(Themes.Li)}><i className="fa-solid fa-sun"></i></span>
                        </li>
                    }
                    {
                        props.lang === Languages.VI ?
                        <li>
                            <span onClick={()=>handleChangeLanguage(Languages.EN)}>EN</span>
                        </li>
                        :
                        <li>
                            <span onClick={()=>handleChangeLanguage(Languages.VI)}>VI</span>
                        </li>
                    } 
                </ul>
            </div>
        </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        theme: state.app.theme,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme)),
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);