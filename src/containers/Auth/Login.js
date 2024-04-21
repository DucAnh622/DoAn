import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { fetchLogin } from '../../services/userService';
import logo  from '../../assets/images/logo.png';
import { Languages, Themes } from "../../utils/constant";
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import { Link } from 'react-router-dom/cjs/react-router-dom';
import _ from 'lodash';

const Login = (props) => {
    
    const dataDefault = {
        valueLogin: '',
        password: ''
    }

    const defaultCheck = {
        valueLogin: true,
        password: true
    }

    const [userData,setUserData] = useState(dataDefault)
    const [checkInput,setCheckInput] = useState(defaultCheck)
    const [showPass,setShowPass] = useState(false)

    const handleChangeInput = (value,name) => {
        let _userData = _.cloneDeep(userData)
        _userData[name]= value
        setUserData(_userData)
        setCheckInput(defaultCheck)
    }

    const handleLogin = async () => {
        let check = validate()
        if(check === true) {
            let response = await fetchLogin(userData);
            if(response && +response.EC === 0) {
                toast.success(props.lang === Languages.VI ? response.EM2 : response.EM1)
                props.userLoginSuccess(response.DT)
            }
            else {
                toast.error(props.lang === Languages.VI ? response.EM2 : response.EM1)
            }
        }
    }

    const handlePressEnter = async (event) => {
        if(event.charCode === 13 && event.code === 'Enter') {
            await handleLogin()
        }
    }

    const validate = () => {
        setCheckInput(defaultCheck)
        let check = true

        let arr = ['valueLogin','password']
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

    const handleShow = () => {
        setShowPass(!showPass)
    }

    const handleChangeLanguage = (language) => {
        props.reduxChangeLanguage(language)
    }

    const handleChangeTheme = (theme) => {
        props.reduxChangeTheme(theme)
    }

    return (
        <>
        <div className='background d-flex align-item-center justify-content-center' data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
            <div className='container'>
            <div className='form-group'>
                <Link to={'/home'}><img src={logo} alt='logo'/></Link>
            </div>    
            <div className="form-group">
                <input value={userData.valueLogin} onChange={(event)=>handleChangeInput(event.target.value,'valueLogin')} type="email" className={checkInput.valueLogin ? "form-control" : "form-control invalid"} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder={props.lang === Languages.VI ? "Email hoặc điện thoại":"Email or phone"}/>
            </div>
            <div className="form-group">
                <input value={userData.password} onChange={(event)=>handleChangeInput(event.target.value,'password')} type={showPass ? "text" : "password"} className={checkInput.password ? "form-control" : "form-control invalid"} id="exampleInputPassword1" placeholder={props.lang === Languages.VI ? "Mật khẩu": "Password"} onKeyPress={(event)=>handlePressEnter(event)}/>
                <i onClick={()=>handleShow()} className={showPass === true ? "fa-solid fa-eye-slash element-child" :"fa-solid fa-eye element-child"}></i>
                <p><span><FormattedMessage id="login.forgot"/> ?</span></p>
            </div>
            <div className='form-group'>
                <button onClick={()=>handleLogin()} type="submit" className="submit w-100"><FormattedMessage id="login.login"/></button>
                <p><FormattedMessage id="login.not have"/> <span><Link to= {'/register'}><FormattedMessage id="login.signup"/></Link></span></p>
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
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
        userLoginFail: () => dispatch(actions.userLoginFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
