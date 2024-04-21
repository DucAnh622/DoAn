import logo  from '../../assets/images/logo.png';
import c1 from '../../assets/images/c1.png';
import c2 from '../../assets/images/c2.png';
import c3 from '../../assets/images/c3.png';
import { FormattedMessage } from 'react-intl';
import './footer.scss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <>
        <div className="footer">
        <div className="footer-top">
            <div className='container'>
                <div className="row">
                    <div className="col-12 col-md-8 col-lg-4">
                        <div className="footer-info">
                            <img src={logo} alt='logo'/>
                            <ul>
                                <li className='p'>
                                    <div><i className="fa-solid fa-location-dot"></i> <FormattedMessage id="footer.infoOne-1"/> </div>
                                </li>
                                <li className='p'>
                                    <div><i className="fa-solid fa-circle-check"></i> <FormattedMessage id="footer.infoOne-2"/></div>
                                </li>
                                <li className='p'>
                                    <div><FormattedMessage id="footer.infoOne-3"/></div>
                                    <span><FormattedMessage id="footer.infoOne-4"/></span>
                                </li>
                                <li className='p'>
                                    <div><FormattedMessage id="footer.infoOne-5"/></div>
                                    <span><FormattedMessage id="footer.infoOne-6"/></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-4">
                        <div className="footer-info">
                            <ul>
                                <li>
                                    <Link className="Link" exact to='/home'><FormattedMessage id="header.home"/></Link>
                                </li>
                                <li>
                                    <Link className="Link" to='#'><FormattedMessage id="header.coporation"/></Link>
                                </li>
                                <li>
                                    <Link className="Link" to='#'><FormattedMessage id="header.rules"/></Link>
                                </li>
                                <li>
                                    <Link className="Link" to='#'><FormattedMessage id="header.lock"/></Link>
                                </li>
                                <li>
                                    <Link className="Link" to='#'><FormattedMessage id="header.Contact and support"/></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-4">
                        <div className="footer-info">
                        <h5><FormattedMessage id="footer.company-title"/></h5>
                            <ul>
                                <li>
                                    <Link to='#'>
                                        <img src={c1} alt='company'/>
                                        <div className='text'>
                                            <h5><FormattedMessage id="footer.company-name"/></h5>
                                            <div><FormattedMessage id="footer.company-des"/></div>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to='#'>
                                        <img src={c2} alt='company'/>
                                        <div className='text'>
                                            <h5><FormattedMessage id="footer.company-name"/></h5>
                                            <div><FormattedMessage id="footer.company-des"/></div>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to='#'>
                                        <img src={c3} alt='company'/>
                                        <div className='text'>
                                            <h5><FormattedMessage id="footer.company-name"/></h5>
                                            <div><FormattedMessage id="footer.company-des"/></div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr/>
                    <div className='col-12'>
                        <div className='footer-top-des'>
                            <div className='footer-link'><i className="fa-solid fa-mobile"></i> <FormattedMessage id="footer.about"/><Link to='#'>Android</Link> - <Link to='#'>iPhone/iPad</Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <div className='container'>
                <div className="row row-scss">
                    <div className="col-lg-8 col-12">
                        <div className="footer-bottom-text">
                            Copyright © {(new Date().getFullYear())} All rights reserved | This template is made with <i className="fa-solid fa-heart"></i> by <Link to="#" target="_blank">Booking<span>.Com</span></Link>
                        </div> 
                    </div>
                    <div className= "col-lg-4 col-12">
                        <ul className="footer-bottom-link">
                            <li><Link to='#'><i className="fa-brands fa-facebook"></i></Link></li>
                            <li><Link to='#'><i className="fa-brands fa-twitter"></i></Link></li>
                            <li><Link to='#'><i className="fa-brands fa-dribbble"></i></Link></li>
                            <li><Link to='#'><i className="fa-brands fa-behance"></i></Link></li>
                        </ul>
                    </div>   
                </div>
            </div>
        </div>
        </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        theme: state.app.theme,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);