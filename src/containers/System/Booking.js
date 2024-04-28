import React, { Component, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Languages, manageActions, roleUsers } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import _ from 'lodash';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import '../System/UserManage.scss';
import { getBookingManage , confirmBookingManage, cancelBookingManage, filterBookingManage} from '../../services/bookingService';
import { fetchVerify} from '../../services/patientService';
import moment from 'moment';
import DatePicker from "react-datepicker";
import ConfirmBooking from './ConfirmBooking';
import LoadingOverlay from 'react-loading-overlay';
import CancelBooking from './CancelBooking';
import DoneBooking from './DoneBooking';
const Booking = (props) => {

    const [listBooking,setListBooking] = useState([])
    const [isActive,setActive] = useState(false)
    const [totalPages,setTotalPages] = useState(0)
    const [limit,setLimit] = useState(4)
    const [page,setPage] = useState(1)
    const [showConfirm,setShowConfirm] = useState(false)
    const [showDone,setShowDone] = useState(false)
    const [showCancel,setShowCancel] = useState(false)
    const [dataBooking,setdataBooking] = useState({})
    const [type,setType] = useState("")

    const dataDefault = {
        date: moment().format('YYYY-MM-DD'),
        id: props.userRedux.id,
    }

    const [data,setData] = useState(dataDefault)

    useEffect(() => {
        if(type) {
            handleFilter()
        }else {
            getBookingList();
        }
    }, [page,data]);

    const getBookingList = async () => {
        let res = await getBookingManage(data,limit,page)
        if(res && res.EC === 0) {
            setListBooking(res.DT.data)
            setTotalPages(res.DT.totalPages)
        }
    }

    const handlePageClick = (event) => {
        setPage(+event.selected+1)
    }

    const handleChangeInput = (value,name) => {
        let _data = _.cloneDeep(data)
        _data[name]= value
        setData({..._data,date: moment(_data.date).format('YYYY-MM-DD')})
        getBookingList()
    }

    const handleConfirm = (item) => {
        setdataBooking(item)
        setShowConfirm(true)
    }

    const handleDone = (item) => {
        setdataBooking(item)
        setShowDone(true)
    }

    const handleCancel = (item) => {
        setdataBooking(item)
        setShowCancel(true)
    }

    const handleClose = () => {
        setShowConfirm(false)
        setShowDone(false)
        setShowCancel(false)
        setdataBooking({})
    }

    const submitDone = async (dataSubmit) => {
        let res = await confirmBookingManage(dataSubmit)
        setActive(false)
        if(res && res.EC === 0) {
            toast.success(props.lang === Languages.VI ? res.EM2 : res.EM1)
        }
        else {
            toast.error(props.lang === Languages.VI ? res.EM2 : res.EM1)
        }
        await getBookingList()
    }

    const submitConfirm = async (dataSubmit) => {
        let res = await fetchVerify(dataSubmit)
        setActive(false)
        if(res && res.EC === 0) {
            toast.success(props.lang === Languages.VI ? "Đã gọi điện xác nhận" : "Called to confirm")
        }
        else {
            toast.error(props.lang === Languages.VI ? res.EM2 : res.EM1)
        }
        await getBookingList()
    }

    const submitCancel = async (dataCancel) => {
        let res = await cancelBookingManage(dataCancel)
        setActive(false)
        if(res && res.EC === 0) {
            toast.success(props.lang === Languages.VI ? res.EM2 : res.EM1)
        }
        else {
            toast.error(props.lang === Languages.VI ? res.EM2 : res.EM1)
        }
        await getBookingList()
    }

    const handleFilter = async () => {
        if(type) {
           let res = await filterBookingManage(type,data,limit,page)
           if(res && res.EC === 0) {
                setListBooking(res.DT.data)
                setTotalPages(res.DT.totalPages)
           }
        }
        else {
            getBookingList()
        }
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

    
 
    return (
        <>
        <LoadingOverlay
            active={isActive}
            spinner
            text='Loading...'
        >
        <div className='container'>
        <h4 className='m-0'>{ props.userRedux.roleId === roleUsers.DOCTOR ? <FormattedMessage id="menu.system.system-administrator.doc-schedule"/>  : <FormattedMessage id="menu.system.system-administrator.product-manage"/>}</h4>
        <div className='row mb-3'>
            <div className='form-group col-12 mb-3 col-sm-3'>
                <label className='text-justify'><FormattedMessage id="Booking.date"/>:</label>
                <span className='form-control mt-2 date-input'>
                    <DatePicker
                        className="form-control"
                        selected={data.date ? moment(data.date).toDate() : null}
                        value={moment(data.date)}
                        onChange={(date) => handleChangeInput(date, 'date')}  
                    />
                </span>
            </div>
            <div className='form-group col-12 mb-3 col-sm-3'>
            <label className='text-justify'><FormattedMessage id="system.user-manage.status"/>:</label>
            {
                props.userRedux.roleId !== roleUsers.DOCTOR ?
                <>
                <div className='d-flex mt-3'>
                    <select className="form-select" id="type" name="type" value={type} onChange={(event)=>setType(event.target.value)}> 
                        {
                            props.lang === Languages.VI ?
                            <>
                            <option value="">Tất cả</option>
                            <option value="1">Lịch hẹn mới</option>
                            <option value="2">Đã xác nhận</option>
                            <option value="3">Đã khám</option>
                            <option value="4">Đã hủy</option>
                            </>
                            :
                            <>
                            <option value="">All</option>
                            <option value="1">New</option>
                            <option value="2">Confirmed</option>
                            <option value="3">Done</option>
                            <option value="4">Cancel</option>
                            </>
                        }
                    </select>
                    <button className="btn btn-danger text-white" type="submit" onClick={()=>handleFilter()}><FormattedMessage id="common.filter"/></button>
                </div>
                </>
                :
                <>
                <div className='d-flex mt-3'>
                    <select className="form-select" id="type" name="type" value={type} onChange={(event)=>setType(event.target.value)}> 
                        {
                            props.lang === Languages.VI ?
                            <>
                            <option value="">Tất cả</option>
                            <option value="2">Chưa khám</option>
                            <option value="3">Đã khám</option>
                            <option value="4">Đã hủy</option>
                            </>
                            :
                            <>
                            <option value="">All</option>
                            <option value="2">New appointment</option>
                            <option value="3">Done</option>
                            <option value="4">Cancel</option>
                            </>
                        }
                    </select>
                    <button className="btn btn-danger text-white" type="submit" onClick={()=>handleFilter()}><FormattedMessage id="common.filter"/></button>
                </div>
                </>
            }
            </div>
            <div className='table-responsive'>
            <table className="table table-bordered">
            <thead className='table table-light'>
                <tr>
                <th scope="col">ID </th>
                <th scope="col"><i className="fa-solid fa-users"></i> <FormattedMessage id="system.user-manage.Booking"/></th>
                <th scope="col"><i className="fa-solid fa-phone"></i> <FormattedMessage id="system.user-manage.mobile"/></th>
                <th scope="col"><i className="fa-solid fa-clock"></i> <FormattedMessage id="system.user-manage.dateTime"/></th>
                <th scope="col"><i className="fa-solid fa-user-doctor"></i> <FormattedMessage id="system.user-manage.doctor"/></th>
                <th scope="col"><i class="fa-solid fa-bookmark"></i> <FormattedMessage id="system.user-manage.status"/></th>
                <th scope="col"><i className="fa-solid fa-gear"></i> <FormattedMessage id="system.user-manage.option"/></th>
                </tr>
            </thead>
            <tbody>
                {
                    listBooking && listBooking.length > 0 ?
                    <>
                    {
                        listBooking.map((item, index)=>{
                            
                            return (
                                <tr key={`row-${index}`}>
                                    <th scope="row">{(page - 1) * limit + index + 1}</th>
                                    <td>{item.patientData.fullname}</td>
                                    <td>{item.patientData.phone}</td>
                                    <td>{item.Time.timeType}</td>
                                    <td>{item.doctorDataBooking.fullname}</td>
                                    <td>
                                        <div className={statusColor(item.statusId)}>
                                        {props.userRedux.roleId !== roleUsers.DOCTOR
                                         ? 
                                         props.lang === Languages.VI ? item.Status.valueVI : item.Status.valueEN
                                         :
                                         item.statusId === 2 ?
                                         props.lang === Languages.VI ? "Chưa khám" : "New appointment"
                                         :
                                         props.lang === Languages.VI ? item.Status.valueVI : item.Status.valueEN
                                        }
                                        </div>
                                    </td>
                                    <td>
                                        <div className='d-flex alin-item-center justify-content-between'>
                                            <button onClick={()=>handleConfirm(item)} className='btn btn-warning text-white w-100' style={{marginRight:8}}><i className="fa-solid fa-eye"></i> </button>
                                            {
                                                props.userRedux.roleId !== roleUsers.DOCTOR &&
                                                item.statusId !== 3 && item.statusId !== 4 &&
                                                <>
                                                {
                                                    item.statusId === 2 &&
                                                    <button onClick={()=>handleDone(item)} className='btn btn-primary text-white w-100' style={{marginRight:8}}><i className="fa-solid fa-calendar-check"></i> </button>
                                                }
                                                <button onClick={()=>handleCancel(item)} className='btn btn-danger text-white w-100' style={{marginRight:8}}><i className="fa-solid fa-rectangle-xmark"></i> </button>
                                                </>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </>
                    :
                    <tr>
                        <td colSpan={6}>No result</td>
                    </tr>
                }
            </tbody>
            </table>
            </div>
        </div>
        {totalPages > 1 &&
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
        </LoadingOverlay>
        <ConfirmBooking
        showConfirm={showConfirm}
        handleClose={handleClose}
        setActive={setActive}
        dataBooking={dataBooking}
        submitConfirm={submitConfirm}
        />
        <DoneBooking
        showDone={showDone}
        handleClose={handleClose}
        setActive={setActive}
        dataBooking={dataBooking}
        submitDone={submitDone}
        />
        <CancelBooking
        showCancel={showCancel}
        handleClose={handleClose}
        dataBooking={dataBooking}
        setActive={setActive}
        submitCancel={submitCancel}
        />
        </>
    )
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        userRedux: state.user.userInfo,
        lang: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Booking);