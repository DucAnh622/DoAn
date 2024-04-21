import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/UserManage";
import Header from "../containers/Header/Header";
import { FormattedMessage } from "react-intl";
import { roleUsers } from "../utils/constant";
import { appChangeLanguage } from "../store/actions/appActions";
import * as actions from "../store/actions";
import Hospital from "../containers/System/Hosptial";
import Speciality from "../containers/System/Speciality";
import Doctor from "../containers/System/Doctor";
import Booking from "../containers/System/Booking";
import DateManage from "../containers/System/DateManage";
import "./System.scss";
import Dashboard from "../containers/System/Dashboard";
import DoctorInfo from "../containers/System/Doctor/DoctorInfo";
import EmployeeInfo from '../containers/System/Employee/EmployeeInfo';
import { adminMenu, doctorMenu, staffMenu } from "../containers/Header/menuApp";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import PatientManage from "../containers/System/PatientManage";
const System = (props) => {
  const history = useHistory();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (props.userInfo && !_.isEmpty(props.userInfo)) {
      let role = props.userInfo.roleId;
      let newMenu = [];
      switch (role) {
        case roleUsers.ADMIN:
          newMenu = adminMenu;
          break;
        case roleUsers.DOCTOR:
          newMenu = doctorMenu;
          break;
        case roleUsers.STAFF:
          newMenu = staffMenu;
          break;
        default:
          history.push("/home");
          break;
      }
      setMenu(newMenu);
    }
  }, []);

  return (
    <>
      {props.isLoggedIn && props.userInfo.roleId !== roleUsers.PATIENT  ? (
        <>
          <Header />
          <div className="system">
            <div className="row DB">
              <div className="col-sm-2 col-0">
                <div className="sidebar">
                  <div className="sidebar-menu">
                    <ul>
                      {menu &&
                        menu.length > 0 &&
                        menu.map((item, index) => {
                          return (
                            <li key={index}>
                              <NavLink to={item.link} className="link">
                                <p>
                                  <i className={item.icon}></i>{" "}
                                  <FormattedMessage id={item.name} />
                                </p>{" "}
                                <i className="fa-solid fa-angle-right"></i>
                              </NavLink>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-10 col-12">
                <div className="content">
                  <Switch>
                    <Route path="/system/dashboard" component={Dashboard} />
                    <Route path="/system/patient-manage" component={PatientManage} />
                    <Route path="/system/user-manage" component={
                            props.userInfo.roleId !== roleUsers.ADMIN 
                            ? 
                            props.userInfo.roleId === roleUsers.DOCTOR 
                            ? 
                            DoctorInfo 
                            : 
                            EmployeeInfo 
                            : 
                            UserManage
                        } />
                    <Route
                      path={
                        props.userInfo.roleId === roleUsers.ADMIN
                          ? "/system/hospital-manage"
                          : "/system/dashboard"
                      }
                      component={
                        props.userInfo.roleId === roleUsers.ADMIN && Hospital
                      }
                    />
                    <Route
                      path={
                        props.userInfo.roleId === roleUsers.ADMIN
                          ? "/system/speciality-manage"
                          : "/system/dashboard"
                      }
                      component={
                        props.userInfo.roleId === roleUsers.ADMIN && Speciality
                      }
                    />
                    <Route path="/system/booking-manage" component={Booking} />
                    <Route
                      path="/doctor/doctor-manage"
                      component={
                        props.userInfo.roleId !== roleUsers.Staff && Doctor
                      }
                    />
                    <Route
                      path="/doctor/date-manage"
                      component={
                        props.userInfo.roleId !== roleUsers.Staff && DateManage
                      }
                    />
                    <Route
                      component={() => {
                        return <Redirect to="/system/dashboard" />;
                      }}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Route
          component={() => {
            return <Redirect to="/home" />;
          }}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    systemAdminPath: state.app.systemAdminPath,
    userInfo: state.user.userInfo,
    lang: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
    reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
