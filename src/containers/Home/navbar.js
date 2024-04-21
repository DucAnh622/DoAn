import { FormattedMessage } from 'react-intl';
import avatar  from '../../assets/images/avatar.png';
import './navbar.scss';
import * as actions from "../../store/actions";
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { appChangeLanguage, appChangeTheme } from '../../store/actions/appActions';
import { Languages, roleUsers, Themes } from "../../utils/constant";
import { Buffer } from 'buffer';
const Navbar = (props) => {
    return(
        <div className={props.showMenu ? 'header-navbar open' :'header-navbar'} ref={props.refClose}>
        <ul>
            {
                 props.userInfo && props.userInfo.roleId === roleUsers.PATIENT ?
                 <>
                 <li>
                    <div className='user'>
                        <img alt='' src={props.userInfo && props.userInfo.image ? Buffer(props.userInfo.image,'base64').toString('binary') : avatar}/>
                        <p>{props.userInfo.fullName}</p>
                    </div>
                 </li>
                 <li>
                    <Link to={`/my-account/${props.userInfo.id}`}><i className="fa-solid fa-pen-fancy"></i> <FormattedMessage id="header.account"/></Link>
                 </li>
                 <li>
                    <Link to={`/my-history/${props.userInfo.id}`}><i className="fa-solid fa-clock-rotate-left"></i> <FormattedMessage id="common.history"/></Link>
                 </li>
                 </>
                 :
                 <li>
                    <Link to='/login'><i className="fa-solid fa-user"></i> <FormattedMessage id="header.account"/></Link>
                 </li> 
            }
            <li>
                <NavLink exact to='/home'><i className="fa-solid fa-house"></i> <FormattedMessage id="header.home"/></NavLink>
            </li>
            <li>
                <Link to='/search'><i className="fa-solid fa-magnifying-glass"></i> <FormattedMessage id="header.search"/></Link>
            </li>
            <li>
                <NavLink to='/specialities'><i className="fa-solid fa-star-of-life"></i> <FormattedMessage id="header.speciality"/></NavLink>
            </li>
            <li>
                <NavLink to='/doctors'><i className="fa-solid fa-briefcase-medical"></i> <FormattedMessage id="header.doctor"/></NavLink>
            </li>
            <li>
                <NavLink to='/hospitals'><i className="fa-solid fa-hospital"></i> <FormattedMessage id="header.health-facility"/></NavLink>
            </li>
            <li>
                <Link to='#'><i className="fa-solid fa-book-open"></i> <FormattedMessage id="header.medical process"/></Link>
            </li>
            <li>
                <Link to='#'><i className="fa-solid fa-book-medical"></i> <FormattedMessage id="header.handbook"/></Link>
            </li>
            <li>
                <Link to='#'><i className="fa-solid fa-circle-question"></i> <FormattedMessage id="header.question"/></Link>
            </li>
            <li>
                <Link to='#'><i className="fa-solid fa-handshake-simple"></i> <FormattedMessage id="header.coporation"/></Link>
            </li>
            <li>
                <Link to='#'><i className="fa-solid fa-circle-info"></i> <FormattedMessage id="header.rules"/></Link>
            </li>
            <li>
                <Link to='#'><i className="fa-solid fa-lock"></i> <FormattedMessage id="header.lock"/></Link>
            </li>
            <li>
                <Link to='#'><i className="fa-solid fa-address-book"></i> <FormattedMessage id="header.Contact and support"/></Link>
            </li>
            {
                props.userInfo && props.userInfo.roleId === roleUsers.PATIENT &&
                <li>
                    <Link to='/login' onClick={props.processLogout}><i className="fa-solid fa-right-from-bracket"></i><FormattedMessage id="header.logout"/></Link>
                </li> 
            }
        </ul>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

