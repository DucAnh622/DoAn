import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter,Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils'
import Home from '../routes/Home';
import Login from '../containers/Auth/Login';
import System from '../routes/System';
import DoctorRoute from '../routes/DoctorRoute';
import StaffRoute from '../routes/StaffRoute';
import Index from '../containers/Home/index';
import DetailDoctor from '../containers/Patient/DetailDoctor';
import Register from '../containers/Auth/Register';
import Verify from '../containers/Home/verify';
import DetailSpeciality from '../containers/Speciality/DetailSpeciality';
import DetailClinic from '../containers/Clinic/DetailClinic';
import History from '../containers/Patient/History';
import Patient from '../containers/Patient/Patient';
import Search from '../containers/Patient/Search';
import AllDoctor from '../containers/SectionPage/AllDoctor';
import AllSpeciality from '../containers/SectionPage/AllSpeciality';
import AllHospital from '../containers/SectionPage/AllHospital';

const AppRoute = (props) => {
    return(
        <>
            <Switch>
                <Route path={path.HOME} exact component={(Home)} />
                <Route path={path.INDEX} component={(Index)}></Route>
                <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                <Route path={path.REGISTER} component={userIsNotAuthenticated(Register)} />     
                <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                <Route path={path.DOCTOR} component={userIsAuthenticated(DoctorRoute)} />
                <Route path={path.STAFF} component={userIsAuthenticated(StaffRoute)} />
                <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                <Route path={path.DETAIL_SPECIALITY} component={DetailSpeciality}/>
                <Route path={path.DETAIL_CLINIC} component={DetailClinic}/>
                <Route path={path.VERIFY_BOOKING} component={Verify} />
                <Route path={path.MY_HISTORY} component={History}/>
                <Route path={path.MY_ACCOUNT} component={Patient}/>
                <Route path={path.SEARCH} component={Search}/>
                <Route path={path.DOCTORS} component={AllDoctor}/>
                <Route path={path.SPECIALITIES} component={AllSpeciality}/>
                <Route path={path.HOSPITALS} component={AllHospital}/>
                <Route path='*'>
                    <div>Page 404 not found!</div>
                </Route>
            </Switch>
        </>
    )
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRoute);