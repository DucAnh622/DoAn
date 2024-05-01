import React, { Component, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../System/UserManage.scss';
import { fetchPatient } from '../../services/userService';
import { Languages, roleUsers } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";
import Dashboard from '../System/Dashboard';
import DetailPatient from './DetailPatient';

const PatientManage = (props) => {
    const [listUsers,setListUsers] = useState([])
    const [totalPages,setTotalPages] = useState(0)
    const [limit,setLimit] = useState(4)
    const [page,setPage] = useState(1)
    
    useEffect(()=>{
        getUsers()
    },[page])

    const getUsers = async () => {
        let response = await fetchPatient(page,limit);
        if(response && response.EC === 0) {
            setListUsers(response.DT.data)
            setTotalPages(response.DT.totalPages)
        }
    }

    const handlePageClick = (event) => {
        setPage(+event.selected+1)
    }

    const formatDate = (date) => {
        let format = ''
        if(date) {
            let datePart = date.split("-")
            format = `${datePart[2]}/${datePart[1]}/${datePart[0]}`;
        }
        return format;
    }

    const [showView,setShowView] = useState(false)
    const [infoView,setInfoView] = useState({})
 
    const handleView = (item) => {
        setShowView(true)
        setInfoView(item)
    }

    const handleClose = () => {
        setShowView(false)
        setInfoView({})    
    }

    return (
        <>
        {
        props.userRedux && props.userRedux.roleId === roleUsers.ADMIN ?
        <div className='container'>
            <h4><FormattedMessage id="menu.system.system-administrator.user-manage-redux"/></h4>
            <div className='table-responsive'>
            <table className="table table-bordered">
            <thead className='table table-light'>
                <tr>
                <th scope="col">ID </th>
                <th scope="col"><i className="fa-solid fa-users"></i> <FormattedMessage id="system.user-manage.name"/></th>
                <th scope="col"><i className="fa-solid fa-venus-mars"></i> <FormattedMessage id="system.user-manage.gender"/></th>
                <th scope="col"><i className="fa-solid fa-envelope"></i> <FormattedMessage id="system.user-manage.email"/></th>              
                <th scope="col"><i className="fa-solid fa-calendar-check"></i> <FormattedMessage id="system.user-manage.Done"/></th>                
                <th scope="col"><i className="fa-solid fa-calendar-check"></i> <FormattedMessage id="system.user-manage.New"/></th>
                <th scope="col"><i className="fa-solid fa-gear"></i> <FormattedMessage id="system.user-manage.option"/></th>
                </tr>
            </thead>
            <tbody>
                <>
                {listUsers && listUsers.length > 0 ? 
                    <>
                    {listUsers.map((item, index)=>{
                        let genderVi = `${item.Gender.valueVI}`,
                            genderEn = `${item.Gender.valueEN}`,
                            date = formatDate(item.lastDate)
                            if(item.bookingCount > 0) {
                                return(
                                    <tr key={`row-${index}`}>
                                        <th scope="row">{(page - 1) * limit + index + 1}</th>
                                        <td>{item.fullName}</td>
                                        <td>
                                            {
                                                props.lang === Languages.VI ?
                                                genderVi
                                                :
                                                genderEn
                                            }
                                        </td>
                                        <td>{item.email}</td>
                                        <td>{item.bookingCount}</td>
                                        <td>{date}</td>
                                        <td>
                                            <div className='d-flex alin-item-center justify-content-between'>
                                                <button onClick={()=>handleView(item)} className='btn btn-warning w-100'><i className="fa-solid fa-eye"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                    })}
                    </>
                    :
                    <tr>
                        <td colSpan={9}>No result</td>
                    </tr>
                }
                </>
            </tbody>
            </table>
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
        <DetailPatient
         showView={showView}
         handleClose={handleClose}
         infoView={infoView}  
        />    
        </div>
        :
        <Dashboard/>
        }
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        userRedux: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientManage);
