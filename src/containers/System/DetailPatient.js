import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Languages } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";
import _ from 'lodash';
import { CommonUtils } from "../../utils";
import { fetchPatientBook} from '../../services/userService';
import ReactPaginate from 'react-paginate';
import './DetailPatient.scss'

const DetailPatient = (props) => {
    const [listBook,setListBook] = useState([])
    const [totalPages,setTotalPages] = useState(0)
    const [limit,setLimit] = useState(4)
    const [page,setPage] = useState(1)

    const getList = async (id) => {
        let res = await fetchPatientBook(id,limit,page)
        if(res && res.EC === 0) {
            setTotalPages(res.DT.totalPages)
            setListBook(res.DT.data)
        }
    }

    const handlePageClick = (event) => {
        setPage(+event.selected+1)
    }

    useEffect(()=>{
        if(props.infoView && props.infoView.id)
        {
            getList(props.infoView.id)
        }
    },[props.infoView,page])

    const handleCloseModal = () => {
        props.handleClose()
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
        <>
        <Modal show={props.showView} data-theme ='Li'  onHide={()=>handleCloseModal()} centered>
            <Modal.Header closeButton>
            <Modal.Title><FormattedMessage id="Booking.info-patient"/></Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {
                listBook && listBook.length > 0 ?
                <div className='table-responsive table-theme'>
                    <table className="table table-bordered">
                    <thead className='table'>
                        <tr>
                        <th scope="col" style={{minWidth:"50px"}}>ID </th>
                        <th scope="col"><i className="fa-solid fa-calendar-days"></i> <FormattedMessage id="Doctor-info.date"/></th>
                        <th scope="col"><i className="fa-solid fa-user-doctor"></i> <FormattedMessage id="system.user-manage.patientName"/></th>
                        <th scope="col"><i className="fa-solid fa-clock"></i> <FormattedMessage id="system.user-manage.dateTime"/></th>
                        <th scope="col"><i className="fa-solid fa-user-doctor"></i> <FormattedMessage id="system.user-manage.doctor"/></th>
                        <th scope="col"><i className="fa-solid fa-star-of-life"></i> <FormattedMessage id="menu.system.system-administrator.spe-manage"/></th>
                        <th scope="col" style={{minWidth:"230px"}}><i className="fa-solid fa-house-medical"></i> <FormattedMessage id="menu.system.system-administrator.hos-manage"/></th>
                        <th scope="col"><i className="fa-solid fa-user-check"></i> <FormattedMessage id="common.confirm"/></th>
                        <th scope="col"><i className="fa-solid fa-bookmark"></i> <FormattedMessage id="system.user-manage.status"/></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        listBook.map((item, index)=>{
                            let Date = formatDate(item.date)
                            return (
                                <tr key={`row-${index}`}>
                                    <th scope="row" style={{minWidth:"50px"}}>{(page - 1) * limit + index + 1}</th>
                                    <td>{Date}</td>
                                    <td>{item.patientName}</td>
                                    <td>
                                        {
                                            item.Time.timeType    
                                        }
                                    </td>
                                    <td>{item.doctorDataBooking.fullname}</td>
                                    <td>{item.doctorDataBooking&&item.doctorDataBooking.Doctor_Infor&&item.doctorDataBooking.Doctor_Infor.Speciality&&item.doctorDataBooking.Doctor_Infor.Speciality.name}</td>
                                    <td style={{minWidth:"230px"}}>{item.doctorDataBooking&&item.doctorDataBooking.Doctor_Infor&&item.doctorDataBooking.Doctor_Infor.Clinic&&item.doctorDataBooking.Doctor_Infor.Clinic.name}</td>
                                    <td>{item.staffDataBooking.fullname}</td>
                                    <td>
                                        <div className={statusColor(item.statusId)}>{props.lang === Languages.VI ? item.Status.valueVI : item.Status.valueEN}</div>
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
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={()=>handleCloseModal()}>
                <FormattedMessage id="common.close"/>
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailPatient);