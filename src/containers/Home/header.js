import logo  from '../../assets/images/logo.png';
import avatar  from '../../assets/images/avatar.png';
import { FormattedMessage } from 'react-intl';
import './header.scss';
import * as actions from "../../store/actions";
import { connect, useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { appChangeLanguage, appChangeTheme } from '../../store/actions/appActions';
import { Languages, roleUsers, Themes } from "../../utils/constant";
import { useEffect, useState, useRef } from 'react';
import { Buffer } from 'buffer';
import Navbar from './navbar';

const Header = (props) => {
    const [showInfo,setShowInfo] = useState(false)
    const [showMenu,setShowMenu] = useState(false)

    let refClose = useRef()

    const handleChangeLanguage = (language) => {
        props.reduxChangeLanguage(language)
    }

    const handleChangeTheme = (theme) => {
        props.reduxChangeTheme(theme)
    }

    useEffect(()=> {
        let close = (e) => {
            if(!refClose.current.contains(e.target)) {
                setShowMenu(false)
                setShowInfo(false)
            } 
        }
        document.addEventListener('mousedown',close)
        return()=> {
            document.removeEventListener('mousedown',close)
        }
    })

    return (
        <>
        <div className="header" data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
            <div className='header-content container'>
                <div className='left-content'>
                    <button onClick={()=>setShowMenu(!showMenu)}><i className="fa-solid fa-bars"></i></button>
                    <img src={logo} alt='logo'/>
                </div>
                <div className='center-content hidden-header'>
                    <NavLink to='/home' exact className='link'>
                        <h6><i className="fa-solid fa-house"></i> <FormattedMessage id="header.home"/></h6>
                    </NavLink>
                    <NavLink className='link' to='/specialities'>
                        <h6><i className="fa-solid fa-star-of-life"></i> <FormattedMessage id="header.speciality"/> </h6>
                    </NavLink>
                    <NavLink className='link' to='/hospitals'>
                        <h6><i className="fa-solid fa-hospital"></i> <FormattedMessage id="header.health-facility"/></h6>
                    </NavLink>
                    <NavLink className='link' to='/doctors'>
                        <h6><i className="fa-solid fa-briefcase-medical"></i> <FormattedMessage id="header.doctor"/></h6>
                    </NavLink>
                </div>
                <div className='right-content'>
                    <ul className='option'>
                        <li className='hidden-header'>
                            <Link to='/search'><i className="fa-solid fa-search"></i></Link>
                            
                        </li>
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
                        {
                            props.userInfo && props.userInfo.roleId === roleUsers.PATIENT ?
                            <>
                            <li className='hidden-header'>
                                <div onClick={()=>setShowInfo(!showInfo)} className='logout'>
                                <img alt='' src={props.userInfo && props.userInfo.image ? Buffer(props.userInfo.image,'base64').toString('binary') : avatar}/><i className="fa-solid fa-caret-down"></i>
                                </div>
                            </li>
                            </>
                            :
                            <li className='hidden-header'>
                                <Link to='/login'><i className="fa-solid fa-user"></i></Link>
                            </li> 
                        }
                    </ul>
                </div>
            </div>
        </div>
        <Navbar
            refClose={refClose} 
            showMenu={showMenu}
        />
        {
            props.userInfo && props.userInfo.roleId === roleUsers.PATIENT &&
            <ul className={showInfo ? 'subnav open hidden-subnav': 'subnav hidden-subnav'} ref={refClose}>
            <li className='subnav-li'><Link to={`/my-account/${props.userInfo.id}`} className='subnav-li-a'><i className="fa-solid fa-pen-fancy"></i> <FormattedMessage id="header.account"/></Link></li>
            <li className='subnav-li'><Link to={`/my-history/${props.userInfo.id}`} className='subnav-li-a'><i className="fa-solid fa-clock-rotate-left"></i> <FormattedMessage id="common.history"/> </Link></li>
            <li className='subnav-li'><Link onClick={props.processLogout} className='subnav-li-a' to='/login'><i className="fa-solid fa-right-from-bracket"></i> <FormattedMessage id="header.logout"/></Link></li>
            </ul> 
        }
    </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        theme: state.app.theme,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);