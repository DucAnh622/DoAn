import React, { Component, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "../System/UserManage.scss";
import { toast } from "react-toastify";
import { Languages, roleUsers } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";
import "./Dashboard.scss";
import { fetchUserTotal } from "../../services/userService";
import { getTotalBookingManage, fetchTotalByDay, fetchScheduleByDate} from "../../services/bookingService";
import moment from 'moment';
import avatar  from '../../assets/images/avatar.png';
import { Buffer } from 'buffer';
import CountUp from 'react-countup';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = (props) => {
  const [isLoading,setLoading] = useState(true)
  const [totalUser, setTotalUser] = useState({});
  const [totalBook,setTotalBook] = useState({})
  const { roleId,id } = props.userInfo;
  const date = moment().format('YYYY-MM-DD');
  
  const getTotalUser = async () => {
    let resUser = await fetchUserTotal(id),
        resBook = await getTotalBookingManage (id,date),
        resSchedule = await fetchScheduleByDate (id, date)
    if (resUser && resUser.EC === 0 && resBook && resBook.EC === 0 && resSchedule && resSchedule.EC === 0 ) {
      setTotalUser(resUser.DT);
      setTotalBook(resBook.DT);
      setScheduleByDate(resSchedule.DT)
    }
    setLoading(false)
  };

  const [lastweek,setLastweek] = useState([])

  const [dataByDay,setDataByDay] = useState([])

  const [scheduleByDate,setScheduleByDate] = useState([])

  const getLastweek = () => {
    let all = []
    for(let i = 7; i >= 0; i--) {
        let object = {};
        if(props.lang === Languages.VI) {
            if(i === 0) {
                const formattedDate = moment(new Date()).format('DD/MM');
                const capitalizedDate = `Hôm nay - ${formattedDate}`;
                object.day = capitalizedDate;
            }
            else {
                const formattedDate = moment(new Date()).subtract(i, 'days').format('dddd - DD/MM'); // Lấy ngày trừ đi i ngày từ hôm nay
                const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
                object.day = capitalizedDate;
            }
        }
        else {
            if(i === 0) {
                const formattedDate = moment(new Date()).format('DD/MM');
                const capitalizedDate = `Today - ${formattedDate}`;
                object.day = capitalizedDate;
            }
            else {
                object.label = moment(new Date()).locale('en').subtract(i, 'days').format('dddd - DD/MM'); // Lấy ngày trừ đi i ngày từ hôm nay
            }
        }
        object.value = moment(new Date()).subtract(i, 'days').startOf('day').format('YYYY-MM-DD'); // Lấy ngày trừ đi i ngày từ hôm nay
        all.push(object);
    }
    setLastweek(all)
  }

  const getDataChart = async (day) => {
      let newData = [];
      for (let i = 0; i < day.length; i++) {
          const item = day[i];
          let res = await fetchTotalByDay(id, item.value, item.day);
          if (res && res.EC === 0) {
              newData.push({ date: formatDate(res.DT.date), Appointments: res.DT.totalByDay, Lich: res.DT.totalByDay });
          }
      }
      newData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setDataByDay(newData);
  }

  useEffect(()=>{
      getDataChart(lastweek)
  },[lastweek])

  useEffect(() => {
    getTotalUser()
    getLastweek()
  }, []);

  const formatDate = (date) => {
    let datePart = date.split("-"),
    format = `${datePart[2]}/${datePart[1]}/${datePart[0]}`;
    return format;
  }
  
  const renderAdminDashboard = () => {
    return (
      <>
        <h4>
          <FormattedMessage id="Dashboard.contentAdmin" />
        </h4>
        <div className="row">
          <div className="col-12 col-sm-2">
            <div className="container-item">
              <i className="fa-solid fa-users"></i>
              <span className="num"><CountUp start={0} end={totalUser.totalUser} duration={2} delay={0} /></span>
              <span className="text"><FormattedMessage id="Dashboard.users" /></span>
            </div>
          </div>
          <div className="col-12 col-sm-2">
            <div className="container-item">
              <i className="fa-solid fa-user-injured"></i>
              <span className="num"><CountUp start={0} end={totalUser.totalPatient} duration={2} delay={0} /></span>
              <span className="text"><FormattedMessage id="Dashboard.patients" /></span>
            </div>
          </div>
          <div className="col-12 col-sm-2">
            <div className="container-item">
              <i className="fa-solid fa-user-nurse"></i>
              <span className="num"><CountUp start={0} end={totalUser.totalDoctor} duration={2} delay={0} /></span>
              <span className="text"><FormattedMessage id="Dashboard.doctors" /></span>
            </div>
          </div>
          <div className="col-12 col-sm-2">
            <div className="container-item">
              <i className="fa-solid fa-user-check"></i>
              <span className="num"><CountUp start={0} end={totalUser.totalStaff} duration={2} delay={0} /></span>
              <span className="text"><FormattedMessage id="Dashboard.staffs" /></span>
            </div>
          </div>
          <div className="col-12 col-sm-2">
            <div className="container-item">
              <i className="fa-solid fa-user-tie"></i>
              <span className="num"><CountUp start={0} end={totalUser.totalAdmin} duration={2} delay={0} /></span>
              <span className="text"><FormattedMessage id="Dashboard.admins" /></span>
            </div>
          </div>
          <div className="col-12 col-sm-2">
            <div className="container-item">
              <i className="fa-solid fa-calendar-check"></i>
              <span className="num"><CountUp start={0} end={totalBook.totalBook} duration={2} delay={0} /></span>
              <span className="text"><FormattedMessage id="Dashboard.admin.total appointments" /></span>
            </div>
          </div>
          <div className="col-12 col-sm-3">
              <div className='total-item'>
                  <i class="fa-solid fa-calendar booking"></i>
                  <div className="text">
                      <p><CountUp start={0} end={totalBook.totalNew} duration={2} delay={0} /></p>
                      <p><marquee direction="left"><FormattedMessage id="Dashboard.admin.total confirm" /></marquee></p>
                  </div>
              </div>
          </div>
          <div className="col-12 col-sm-3">
            <div className='total-item'>
                <i class="fa-solid fa-calendar-plus new"></i>
                <div className="text">
                    <p><CountUp start={0} end={totalBook.totalConfirm} duration={2} delay={0} /></p>
                    <p><marquee direction="left"><FormattedMessage id="Dashboard.admin.total new appointments" /></marquee></p>
                </div>
            </div>
          </div>
          <div className="col-12 col-sm-3">
            <div className='total-item'>
                <i className="fa-solid fa-circle-check finish"></i>
                <div className="text">
                    <p><CountUp start={0} end={totalBook.totalDone} duration={2} delay={0} /></p>
                    <p><marquee direction="left"><FormattedMessage id="Dashboard.admin.total finish" /></marquee></p>
                </div>
            </div>
          </div>
          <div className="col-12 col-sm-3">
            <div className='total-item'>
                <i className="fa-solid fa-ban cancel"></i>
                <div className="text">
                    <p><CountUp start={0} end={totalBook.totalCancel} duration={2} delay={0} /></p>
                    <p><marquee direction="left"><FormattedMessage id="Dashboard.admin.total cancel" /></marquee></p>
                </div>
            </div>
          </div>
          {
            totalBook.bestSpe && totalBook.bestSpe.doctorDataBooking &&
            <div className="col-12 col-sm-6">
                <div className="best-item">
                    <div className="img img-spe">
                        <img src={totalBook.bestSpe.doctorDataBooking.Doctor_Infor && totalBook.bestSpe.doctorDataBooking.Doctor_Infor.Speciality && totalBook.bestSpe.doctorDataBooking.Doctor_Infor.Speciality.image ? Buffer(totalBook.bestSpe.doctorDataBooking.Doctor_Infor.Speciality.image ,'base64').toString('binary') : avatar}/>
                    </div>
                    <div className="text">
                    <p><FormattedMessage id="Dashboard.admin.best speciality" />:</p>  
                    <p><i className="fa-solid fa-star-of-life"></i> <FormattedMessage id="slides.speciality"/>: <b>{totalBook.bestSpe.doctorDataBooking.Doctor_Infor && totalBook.bestSpe.doctorDataBooking.Doctor_Infor.Speciality && totalBook.bestSpe.doctorDataBooking.Doctor_Infor.Speciality.name}</b></p>
                    <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best book" />: <b>{totalBook.bestSpe.SpeCount}</b></p>
                    </div>
                </div>
            </div>
          }
          {
            totalBook.bestCli && totalBook.bestCli.doctorDataBooking &&
            <div className="col-12 col-sm-6">
                <div className="best-item">
                    <div className="img img-spe">
                        <img src={totalBook.bestCli.doctorDataBooking.Doctor_Infor && totalBook.bestCli.doctorDataBooking.Doctor_Infor.Clinic && totalBook.bestCli.doctorDataBooking.Doctor_Infor.Clinic.image ? Buffer(totalBook.bestCli.doctorDataBooking.Doctor_Infor.Clinic.image ,'base64').toString('binary') : avatar}/>
                    </div>
                    <div className="text">
                    <p><FormattedMessage id="Dashboard.admin.best clinic" />:</p>  
                    <p><i className="fa-solid fa-star-of-life"></i> <FormattedMessage id="slides.hospital"/>: <b>{totalBook.bestCli.doctorDataBooking.Doctor_Infor && totalBook.bestCli.doctorDataBooking.Doctor_Infor.Clinic && totalBook.bestCli.doctorDataBooking.Doctor_Infor.Clinic.name}</b></p>
                    <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best book" />: <b>{totalBook.bestCli.CliCount}</b></p>
                    </div>
                </div>
            </div>
          }
          {
            totalBook.bestDoc && totalBook.bestDoc.doctorDataBooking &&
            <div className="col-12 col-sm-6">
              <div className="best-item">
                  <div className="img">
                      <img src={totalBook.bestDoc.doctorDataBooking.image ? Buffer(totalBook.bestDoc.doctorDataBooking.image ,'base64').toString('binary') : avatar}/>
                  </div>
                  <div className="text">
                  <p><FormattedMessage id="Dashboard.admin.best doctor" />:</p>  
                  <h4>{props.lang === Languages.VI ? `${totalBook.bestDoc.doctorDataBooking.Position && totalBook.bestDoc.doctorDataBooking.Position.valueVI} ${totalBook.bestDoc.doctorDataBooking.fullname}` : `${totalBook.bestDoc.doctorDataBooking.Position && totalBook.bestDoc.doctorDataBooking.Position.valueEN} ${totalBook.bestDoc.doctorDataBooking.fullname}`}</h4>
                  <p><i className="fa-solid fa-stethoscope"></i> <FormattedMessage id="slides.speciality"/>: <b>{totalBook.bestDoc.doctorDataBooking.Doctor_Infor && totalBook.bestDoc.doctorDataBooking.Doctor_Infor.Speciality && totalBook.bestDoc.doctorDataBooking.Doctor_Infor.Speciality.name}</b></p>
                  <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best book" />: <b>{totalBook.bestDoc.Max_Booking}</b></p>
                  </div>
              </div>
          </div>
          }
          {
            totalBook.bestPat && totalBook.bestPat.patientData &&
            <div className="col-12 col-sm-6">
              <div className="best-item">
                  <div className="img">
                      <img src={totalBook.bestPat.patientData.image ? Buffer(totalBook.bestPat.patientData.image ,'base64').toString('binary') : avatar}/>
                  </div>
                  <div className="text">
                  <p><FormattedMessage id="Dashboard.admin.Unlucky patient today" />:</p>  
                  <h4>{totalBook.bestPat.patientData.fullname}</h4>
                  <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best checked" />: <b>{totalBook.bestPat.Max_Booking}</b></p>
                  </div>
              </div>
          </div>
          }
          {
            totalBook.mostDoc && totalBook.mostDoc.doctorDataBooking &&
            <div className="col-12 col-sm-6">
              <div className="best-item">
                  <div className="img">
                      <img src={totalBook.mostDoc.doctorDataBooking.image ? Buffer(totalBook.mostDoc.doctorDataBooking.image ,'base64').toString('binary') : avatar}/>
                  </div>
                  <div className="text">
                  <p><FormattedMessage id="Dashboard.admin.Popular doctor" />:</p>  
                  <h4>{props.lang === Languages.VI ? `${totalBook.mostDoc.doctorDataBooking.Position && totalBook.mostDoc.doctorDataBooking.Position.valueVI} ${totalBook.mostDoc.doctorDataBooking.fullname}` : `${totalBook.mostDoc.doctorDataBooking.Position && totalBook.mostDoc.doctorDataBooking.Position.valueEN} ${totalBook.mostDoc.doctorDataBooking.fullname}`}</h4>                  
                  <p><i className="fa-solid fa-stethoscope"></i> <FormattedMessage id="slides.speciality"/>: <b>{totalBook.mostDoc.doctorDataBooking.Doctor_Infor && totalBook.mostDoc.doctorDataBooking.Doctor_Infor.Speciality && totalBook.mostDoc.doctorDataBooking.Doctor_Infor.Speciality.name}</b></p>
                  <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.Popular checked" />: <b>{totalBook.mostDoc.Max_Booking}</b></p>
                  </div>
              </div>
            </div>
          }
          {
            totalBook.mostPat && totalBook.mostPat.patientData &&
            <div className="col-12 col-sm-6">
              <div className="best-item">
                  <div className="img">
                      <img src={totalBook.mostPat.patientData.image ? Buffer(totalBook.mostPat.patientData.image ,'base64').toString('binary') : avatar}/>
                  </div>
                  <div className="text">
                  <p><FormattedMessage id="Dashboard.admin.Unlucky patient" />:</p>  
                  <h4>{totalBook.mostPat.patientData.fullname}</h4>
                  <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best checked" />: <b>{totalBook.mostPat.Max_Booking}</b></p>
                  </div>
              </div>
            </div>
          }
          {
            totalBook.mostSpe && totalBook.mostSpe.doctorDataBooking &&
            <div className="col-12 col-sm-6">
                <div className="best-item">
                    <div className="img img-spe">
                        <img src={totalBook.mostSpe.doctorDataBooking.Doctor_Infor && totalBook.mostSpe.doctorDataBooking.Doctor_Infor.Speciality && totalBook.mostSpe.doctorDataBooking.Doctor_Infor.Speciality.image ? Buffer(totalBook.mostSpe.doctorDataBooking.Doctor_Infor.Speciality.image ,'base64').toString('binary') : avatar}/>
                    </div>
                    <div className="text">
                    <p><FormattedMessage id="Dashboard.admin.Popular speciality" />:</p>  
                    <p><i className="fa-solid fa-star-of-life"></i> <FormattedMessage id="slides.speciality"/>: <b>{totalBook.mostSpe.doctorDataBooking.Doctor_Infor && totalBook.mostSpe.doctorDataBooking.Doctor_Infor.Speciality && totalBook.mostSpe.doctorDataBooking.Doctor_Infor.Speciality.name}</b></p>
                    <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best checked" />: <b>{totalBook.mostSpe.SpeCount}</b></p>
                    </div>
                </div>
            </div>
          }
          {
            totalBook.mostCli && totalBook.mostCli.doctorDataBooking &&
            <div className="col-12 col-sm-6">
                <div className="best-item">
                    <div className="img img-spe">
                        <img src={totalBook.mostCli.doctorDataBooking.Doctor_Infor && totalBook.mostCli.doctorDataBooking.Doctor_Infor.Clinic && totalBook.mostCli.doctorDataBooking.Doctor_Infor.Clinic.image ? Buffer(totalBook.mostCli.doctorDataBooking.Doctor_Infor.Clinic.image ,'base64').toString('binary') : avatar}/>
                    </div>
                    <div className="text">
                    <p><FormattedMessage id="Dashboard.admin.Popular clinic" />:</p>  
                    <p><i className="fa-solid fa-star-of-life"></i> <FormattedMessage id="slides.hospital"/>: <b>{totalBook.mostCli.doctorDataBooking.Doctor_Infor && totalBook.mostCli.doctorDataBooking.Doctor_Infor.Clinic && totalBook.mostCli.doctorDataBooking.Doctor_Infor.Clinic.name}</b></p>
                    <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best checked" />: <b>{totalBook.mostCli.CliCount}</b></p>
                    </div>
                </div>
            </div>
          }
          { dataByDay && dataByDay.length > 0 &&
            <div className="col-12 col-sm-6">
                <div className="chart-table">
                  <h4><FormattedMessage id="Dashboard.admin.chart" /></h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={dataByDay}
                      margin={{
                        top: 8,
                        right: 30,
                        left: 30,
                        bottom: 10,
                      }}
                      barSize={20}
                    >
                      <XAxis dataKey="date" scale="point" padding={{ left: 8, right: 8 }} />
                      <YAxis hide={true} tick={null}/>
                      <Tooltip />
                      <Legend />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey={props.lang === Languages.VI ? "Lich" : "Appointments"} fill="#47a0de" background={{ fill: '#eee' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          }
          { scheduleByDate && scheduleByDate.length > 0 &&
            <div className="col-12 col-sm-6">
                <div className="chart-table">
                  <h4><FormattedMessage id="Dashboard.admin.chart book" /></h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={scheduleByDate}
                      margin={{
                        top: 8,
                        right: 30,
                        left: 30,
                        bottom: 10,
                      }}
                      barSize={20}
                    >
                      <XAxis dataKey="Time.timeType" scale="point" padding={{ left: 8, right: 8 }} />
                      <YAxis tick={null} hide={true}/>
                      <Tooltip />
                      <Legend />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey={props.lang === Languages.VI ? "Dat" : "Book"} fill="#47a0de" background={{ fill: '#eee' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          }
        </div>
      </>
    );
  };

  const renderDoctorDashboard = () => {
    return (
      <>
        <h4>
          <FormattedMessage id="Dashboard.contentDoctor" />
        </h4>
        <div className="row">
          <div className="col-6 col-sm-3">
            <div className='total-item '>
                <i class="fa-solid fa-calendar-plus new"></i>
                <div className="text">
                    <p><CountUp start={0} end={totalBook.totalNew} duration={2} delay={0} /></p>
                    <p><marquee direction="left"><FormattedMessage id="Dashboard.Doctor.my new appointments" /></marquee></p>
                </div>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className='total-item'>
                <i className="fa-solid fa-calendar-check finish"></i>
                <div className="text">
                    <p><CountUp start={0} end={totalBook.totalDone} duration={2} delay={0} /></p>
                    <p><marquee direction="left"><FormattedMessage id="Dashboard.Doctor.my finish" /></marquee></p>
                </div>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className='total-item'>
                <i className="fa-solid fa-ban cancel"></i>
                <div className="text">
                    <p><CountUp start={0} end={totalBook.totalCancel} duration={2} delay={0} /></p>
                    <p><marquee direction="left"><FormattedMessage id="Dashboard.Doctor.my cancel" /></marquee></p>
                </div>
            </div>
          </div>  
          <div className="col-0 col-sm-3"></div>
        {
            totalBook.mostPat && totalBook.mostPat.patientData &&
            <div className="col-12 col-sm-6">
              <div className="best-item">
                  <div className="img">
                      <img src={totalBook.mostPat.patientData.image ? Buffer(totalBook.mostPat.patientData.image ,'base64').toString('binary') : avatar}/>
                  </div>
                  <div className="text">
                  <p><FormattedMessage id="Dashboard.admin.Unlucky patient" />:</p>  
                  <h4>{totalBook.mostPat.patientData.fullname}</h4>
                  <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best checked" />: <b>{totalBook.mostPat.Max_Booking}</b></p>
                  </div>
              </div>
          </div>
          }
          <div className="col-12 col-sm-2">
            <div className="container-item">
              <i className="fa-solid fa-user-injured"></i>
              <span className="num"><CountUp start={0} end={totalUser.totalPatient} duration={2} delay={0} /></span>
              <span className="text"><FormattedMessage id="Dashboard.Doctor.completed patient" /></span>
            </div>
          </div>  
          { dataByDay && dataByDay.length > 0 &&
            <div className="col-12 col-sm-6">
                <div className="chart-table">
                  <h4><FormattedMessage id="Dashboard.Doctor.chart" /></h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={dataByDay}
                      margin={{
                        top: 8,
                        right: 30,
                        left: 30,
                        bottom: 10,
                      }}
                      barSize={20}
                    >
                      <XAxis dataKey="date" scale="point" padding={{ left: 8, right: 8 }} />
                      <YAxis hide={true} tick={null}/>
                      <Tooltip />
                      <Legend />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey={props.lang === Languages.VI ? "Lich" : "Appointments"} fill="#47a0de" background={{ fill: '#eee' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          }
          { scheduleByDate && scheduleByDate.length > 0 &&
            <div className="col-12 col-sm-6">
                <div className="chart-table">
                  <h4><FormattedMessage id="Dashboard.admin.chart book" /></h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={scheduleByDate}
                      margin={{
                        top: 8,
                        right: 30,
                        left: 30,
                        bottom: 10,
                      }}
                      barSize={20}
                    >
                      <XAxis dataKey="Time.timeType" scale="point" padding={{ left: 8, right: 8 }} />
                      <YAxis hide={true} tick={null}/>
                      <Tooltip />
                      <Legend />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey={props.lang === Languages.VI ? "Dat" : "Book"} fill="#47a0de" background={{ fill: '#eee' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          }
        </div>
      </>
    );
  };

  const renderStaffDashboard = () => {
    return (
      <>
        <h4>
          <FormattedMessage id="Dashboard.contentStaff" />
        </h4>
        <div className="row">
          <div className="col-6 col-sm-3">
            <div className='total-item'>
                <i class="fa-solid fa-calendar-plus new"></i>
                <div className="text">
                    <p><CountUp start={0} end={totalBook.totalNew} duration={2} delay={0} /></p>
                    <p><marquee direction="left"><FormattedMessage id="Dashboard.Staff.my new appointments" /></marquee></p>
                </div>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className='total-item'>
                <i className="fa-solid fa-calendar-check finish"></i>
                <div className="text">
                    <p><CountUp start={0} end={totalBook.totalConfirm} duration={2} delay={0} /></p>
                    <p><marquee direction="left"><FormattedMessage id="Dashboard.Staff.my finish" /></marquee></p>
                </div>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className='total-item'>
                <i className="fa-solid fa-circle-check booking"></i>
                <div className="text">
                    <p><CountUp start={0} end={totalBook.totalDone} duration={2} delay={0} /></p>
                    <p><marquee direction="left"><FormattedMessage id="Dashboard.Staff.total finish" /></marquee></p>
                </div>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className='total-item'>
                <i className="fa-solid fa-ban cancel"></i>
                <div className="text">
                    <p><CountUp start={0} end={totalBook.totalCancel} duration={2} delay={0} /></p>
                    <p><marquee direction="left"><FormattedMessage id="Dashboard.Staff.my cancel" /></marquee></p>
                </div>
            </div>
          </div>
          {
            totalBook.bestDoc && totalBook.bestDoc.doctorDataBooking &&
            <div className="col-12 col-sm-6">
              <div className="best-item">
                  <div className="img">
                      <img src={totalBook.bestDoc.doctorDataBooking.image ? Buffer(totalBook.bestDoc.doctorDataBooking.image ,'base64').toString('binary') : avatar}/>
                  </div>
                  <div className="text">
                  <p><FormattedMessage id="Dashboard.admin.best doctor" />:</p>  
                  <h4>{props.lang === Languages.VI ? `${totalBook.bestDoc.doctorDataBooking.Position && totalBook.bestDoc.doctorDataBooking.Position.valueVI} ${totalBook.bestDoc.doctorDataBooking.fullname}` : `${totalBook.bestDoc.doctorDataBooking.Position && totalBook.bestDoc.doctorDataBooking.Position.valueEN} ${totalBook.bestDoc.doctorDataBooking.fullname}`}</h4>
                  <p><i className="fa-solid fa-stethoscope"></i> <FormattedMessage id="slides.speciality"/>: <b>{totalBook.bestDoc.doctorDataBooking.Doctor_Infor && totalBook.bestDoc.doctorDataBooking.Doctor_Infor.Speciality && totalBook.bestDoc.doctorDataBooking.Doctor_Infor.Speciality.name}</b></p>
                  <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best book" />: <b>{totalBook.bestDoc.Max_Booking}</b></p>
                  </div>
              </div>
          </div>
          }
          {
            totalBook.bestPat && totalBook.bestPat.patientData &&
            <div className="col-12 col-sm-6">
              <div className="best-item">
                  <div className="img">
                      <img src={totalBook.bestPat.patientData.image ? Buffer(totalBook.bestPat.patientData.image ,'base64').toString('binary') : avatar}/>
                  </div>
                  <div className="text">
                  <p><FormattedMessage id="Dashboard.admin.Unlucky patient today" />:</p>  
                  <h4>{totalBook.bestPat.patientData.fullname}</h4>
                  <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best book" />: <b>{totalBook.bestPat.Max_Booking}</b></p>
                  </div>
              </div>
          </div>
          }
          {
            totalBook.mostDoc && totalBook.mostDoc.doctorDataBooking &&
            <div className="col-12 col-sm-6">
              <div className="best-item">
                  <div className="img">
                      <img src={totalBook.mostDoc.doctorDataBooking.image ? Buffer(totalBook.mostDoc.doctorDataBooking.image ,'base64').toString('binary') : avatar}/>
                  </div>
                  <div className="text">
                  <p><FormattedMessage id="Dashboard.admin.Popular doctor" />:</p>  
                  <h4>{props.lang === Languages.VI ? `${totalBook.mostDoc.doctorDataBooking.Position && totalBook.mostDoc.doctorDataBooking.Position.valueVI} ${totalBook.mostDoc.doctorDataBooking.fullname}` : `${totalBook.mostDoc.doctorDataBooking.Position && totalBook.mostDoc.doctorDataBooking.Position.valueEN} ${totalBook.mostDoc.doctorDataBooking.fullname}`}</h4>
                  <p><i className="fa-solid fa-stethoscope"></i> <FormattedMessage id="slides.speciality"/>: <b>{totalBook.mostDoc.doctorDataBooking.Doctor_Infor && totalBook.mostDoc.doctorDataBooking.Doctor_Infor.Speciality && totalBook.mostDoc.doctorDataBooking.Doctor_Infor.Speciality.name}</b></p>
                  <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.Popular checked" />: <b>{totalBook.mostDoc.Max_Booking}</b></p>
                  </div>
              </div>
          </div>
          }
          {
            totalBook.mostPat && totalBook.mostPat.patientData &&
            <div className="col-12 col-sm-6">
              <div className="best-item">
                  <div className="img">
                      <img src={totalBook.mostPat.patientData.image ? Buffer(totalBook.mostPat.patientData.image ,'base64').toString('binary') : avatar}/>
                  </div>
                  <div className="text">
                  <p><FormattedMessage id="Dashboard.admin.Unlucky patient" />:</p>  
                  <h4>{totalBook.mostPat.patientData.fullname}</h4>
                  <p><i className="fa-solid fa-clipboard-check"></i> <FormattedMessage id="Dashboard.admin.best checked" />: <b>{totalBook.mostPat.Max_Booking}</b></p>
                  </div>
              </div>
          </div>
          }
          { dataByDay && dataByDay.length > 0 &&
            <div className="col-12 col-sm-6">
                <div className="chart-table">
                  <h4><FormattedMessage id="Dashboard.admin.chart" /></h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={400} 
                      height={200}
                      data={dataByDay}
                      margin={{
                        top: 8,
                        right: 30,
                        left: 30,
                        bottom: 10,
                      }}
                      barSize={20}
                    >
                      <XAxis dataKey="date" scale="point" padding={{ left: 8, right: 8 }} />
                      <YAxis hide={true} tick={null}/>
                      <Tooltip />
                      <Legend />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey={props.lang === Languages.VI ? "Lich" : "Appointments"} fill="#47a0de" background={{ fill: '#eee' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          }
          { scheduleByDate && scheduleByDate.length > 0 &&
            <div className="col-12 col-sm-6">
                <div className="chart-table">
                  <h4><FormattedMessage id="Dashboard.admin.chart book" /></h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={scheduleByDate}
                      margin={{
                        top: 8,
                        right: 30,
                        left: 30,
                        bottom: 10,
                      }}
                      barSize={20}
                    >
                      <XAxis dataKey="Time.timeType" scale="point" padding={{ left: 8, right: 8 }} />
                      <YAxis hide={true} tick={null}/>
                      <Tooltip />
                      <Legend />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey={props.lang === Languages.VI ? "Dat" : "Book"} fill="#47a0de" background={{ fill: '#eee' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          }
          <div className="col-12 col-sm-2">
            <div className="container-item">
              <i className="fa-solid fa-user-nurse"></i>
              <span className="num"><CountUp start={0} end={totalUser.totalDoctor} duration={2} delay={0} /></span>
              <span className="text"><FormattedMessage id="Dashboard.Staff.doctor" /></span>
            </div>
          </div>
          <div className="col-12 col-sm-2">
            <div className="container-item">
              <i className="fa-solid fa-user-injured"></i>
              <span className="num"><CountUp start={0} end={totalUser.totalPatient} duration={2} delay={0} /></span>
              <span className="text"><FormattedMessage id="Dashboard.Staff.patient" /></span>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {
        isLoading === true ?
        <div className="circle-loading"></div>
        :
        <>
        {roleId === roleUsers.ADMIN && renderAdminDashboard()}
        {roleId=== roleUsers.DOCTOR && renderDoctorDashboard()}
        {roleId === roleUsers.STAFF && renderStaffDashboard()}
        </>
      }
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
