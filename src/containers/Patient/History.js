import { Component, useState, useEffect  } from 'react';
import { Link, useParams, NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { appChangeLanguage, appChangeTheme } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import './DetailDoctor.scss';
import React from 'react';
import { Languages, Themes } from "../../utils/constant";
import ReactPaginate from 'react-paginate';
import { fetchHistoryBooking} from '../../services/bookingService';
import Header from '../Home/header';
import Footer from '../Home/footer';
import DeleteBooking from './DeleteBooking';
import DetailBooking from './DetailBooking';
import moment from 'moment';
import RateBooking from './RateBooking';

const History = (props) => {
    const { patientId } = useParams();
    const [listHistory,setListHistory] = useState([])
    const [limit,setLimit] = useState(4)
    const [page,setPage] = useState(1)
    const [totalPages,setTotalPages] = useState(0)
    const [dataCancel,setDataCancel] = useState({})
    const [dataDetail,setDataDetail] = useState({})
    const [showCancel,setShowCancel] = useState(false)
    const [showDetail,setShowDetail] = useState(false)
    const [showRes,setShowRes] = useState(false)

    const CompareDate = (date) => {
        let today = moment().format('YYYY-MM-DD')
        if(date > today) {
            return true
        }
        else {
            return false
        }
    }

    useEffect(() => {
        getBookingList();
    }, [page]);

    const getBookingList = async () => {
        let res = await fetchHistoryBooking(patientId,limit,page)
        if(res && res.EC === 0 ) {
            setListHistory(res.DT.data)
            setTotalPages(res.DT.totalPages)
        }
    }

    const handlePageClick = (event) => {
        setPage(+event.selected+1)
    }

    const handleCancel = (item) => {
        setShowCancel(true)
        setDataCancel(item)
    }

    const handleClose = () => {
        setShowCancel(false)
        setShowDetail(false)
        setShowRes(false)
    }

    const handleDetail = (item) => {
        setShowDetail(true)
        setDataDetail(item)
    }

    const handleRes = (item) => {
        setShowRes(true)
        setDataCancel(item)
    }

    const statusColor = (status) => {
        let check = ''
        switch (status) {
            case 1: 
                check = 'status status--wait'
                break;
            case 2: 
                check = 'status status--warning'
                break;
            case 3:
                check = 'status status--success'
                break;
            case 4:
                check = 'status status--danger'
                break;
            default:
                check = ''
                break                
        }
        return check
    }

    const formatDate = (date) => {
        let datePart = date.split("-"),
        format = `${datePart[2]}/${datePart[1]}/${datePart[0]}`;
        return format;
    }
 
    return(
        <div className='index' data-theme={props.theme === Themes.Li ? Themes.Li : Themes.Da}>
            <Header/>
            <div className='Detail-doctor'>
                <div className='container custom'>
                <p className='site'><NavLink to='/home'><i className="fa-solid fa-house"></i> <FormattedMessage id="header.home"/></NavLink> / <i className="fa-solid fa-clock-rotate-left"></i> <FormattedMessage id="common.history"/></p>
                </div>
                <div className='container'>
                    <h4><FormattedMessage id="common.history"/></h4>
                    <div className='row mb-3'>
                        {
                            listHistory && listHistory.length > 0 ?
                            <div className='table-responsive table-theme'>
                                <table className="table table-bordered">
                                <thead className='table'>
                                    <tr>
                                    <th scope="col">ID </th>
                                    <th scope="col"><i className="fa-solid fa-calendar-days"></i> <FormattedMessage id="Doctor-info.date"/></th>
                                    <th scope="col"><i className="fa-solid fa-clock"></i> <FormattedMessage id="system.user-manage.dateTime"/></th>
                                    <th scope="col"><i className="fa-solid fa-user-doctor"></i> <FormattedMessage id="system.user-manage.doctor"/></th>
                                    <th scope="col"><i class="fa-solid fa-bookmark"></i> <FormattedMessage id="system.user-manage.status"/></th>
                                    <th scope="col"><i className="fa-solid fa-gear"></i> <FormattedMessage id="system.user-manage.option"/></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    listHistory.map((item, index)=>{
                                        let check = CompareDate(item.date),
                                            Date = formatDate(item.date)
                                        return (
                                            <tr key={`row-${index}`}>
                                                <th scope="row">{(page - 1) * limit + index + 1}</th>
                                                <td>{Date}</td>
                                                <td>
                                                    {
                                                        item.Time.timeType    
                                                    }
                                                </td>
                                                <td>{item.doctorDataBooking.fullname}</td>
                                                <td>
                                                    <div className={statusColor(item.statusId)}>{props.lang === Languages.VI ? item.Status.valueVI : item.Status.valueEN}</div>
                                                </td>
                                                <td>
                                                    <div className='d-flex alin-item-center justify-content-center'>
                                                        <button onClick={()=>handleDetail(item)} className='btn btn-warning text-white w-100' style={{marginRight:8}}><i className="fa-solid fa-eye"></i> </button>
                                                        {
                                                            item.statusId === 3 && item.comment === null &&
                                                            <button onClick={()=>handleRes(item)} className='btn btn-primary text-while w-100'><i className="fa-solid fa-comment"></i> </button>
                                                        }            
                                                        {
                                                            check === true && item.statusId == 2 &&
                                                            <button onClick={()=>handleCancel(item)} className='btn btn-danger text-white w-100'><i className="fa-solid fa-trash-can"></i> </button>
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                                </table>
                                {totalPages > 0 &&
                                    <div className='pagination'>
                                        <ReactPaginate
                                        nextLabel={<i className="fa-solid fa-chevron-right"></i>}
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={3}
                                        marginPagesDisplayed={2}
                                        pageCount={totalPages}
                                        previousLabel={<i className="fa-solid fa-chevron-left"></i>}
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination"
                                        activeClassName="active"
                                        renderOnZeroPageCount={null}
                                    />
                                    </div>
                                }
                            </div>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
            <DeleteBooking
            showCancel={showCancel}
            handleClose={handleClose}
            dataTheme = {props.theme}
            dataCancel={dataCancel}
            handleCancel={handleCancel}
            getBookingList={getBookingList}
            />
            <RateBooking
            showRes={showRes}
            handleClose={handleClose}
            dataTheme = {props.theme}
            dataCancel={dataCancel}
            handleCancel={handleCancel}
            getBookingList={getBookingList}
            />
            <DetailBooking
            showDetail={showDetail}
            dataTheme = {props.theme}
            handleClose={handleClose}
            dataDetail={dataDetail}
            />
            <Footer/>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        theme: state.app.theme,
        isLoggedIn: state.user.isLoggedIn,
        userRedux: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxChangeTheme: (theme) => dispatch(appChangeTheme(theme))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(History);