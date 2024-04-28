import React, { Component, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../System/UserManage.scss';
import { toast } from 'react-toastify';
import { fetchGetUser, fetchSearchUser, fetchFilterUser, fetchDeleteUser } from '../../services/userService';
import Create_Edit_User from '../System/Create_Edit_User';
import Delete_User from './Delete_User';
import { Languages, roleUsers } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";

const UserManage = (props) => {
    const [listUsers,setListUsers] = useState([])
    const [totalPages,setTotalPages] = useState(0)
    const [limit,setLimit] = useState(4)
    const [page,setPage] = useState(1)
    const [showDelete,setShowDelete] = useState(false)
    const [showCreate,setShowCreate] = useState(false)
    const [dataUpdate,setDataUpdate] = useState({})
    const [dataDelete,setDataDelete] = useState({})
    const [keyword,setKeyword] = useState("")
    const [type,setType] = useState("")
    const [sort,setSort] = useState("")
    const [actionModalUser,setActionModalUser] = useState("CREATE")
    
    useEffect(()=>{
        if(keyword) {
            handleSearch()
        } 
        else {
            if(type) {
                handleFilter()
            }
            else {
                getUsers()
            }
        }
    },[page])

    const getUsers = async () => {
        let response = await fetchGetUser(limit,page);
        if(response && response.EC === 0) {
            setListUsers(response.DT.data)
            setTotalPages(response.DT.totalPages)
        }
    }

    const handlePageClick = (event) => {
        setPage(+event.selected+1)
    }

    const handleCreate = () => {
        setShowCreate(true)
        setActionModalUser("CREATE")
    }

    const handleDelete = (user) => {
        setDataDelete(user)
        setShowDelete(true)
    }

    const handleEdit = (user) => {
        setShowCreate(true)
        setDataUpdate(user)
        setActionModalUser("UPDATE")
    }

    const handleClose = () => {
        setShowCreate(false)
        setShowDelete(false)
        setDataDelete({})
        setDataUpdate({})
    }

    const handleFilter = () => {
        filterUsers()
    }

    const handlePressEnter = (event) => {
        if(event.charCode === 13 && event.code === 'Enter') {
            handleSearch()
        }
    }

    const handleSearch = () => {
        searchUsers()
    }

    const searchUsers = async () => {
        if(keyword) {
            let list = await fetchSearchUser(limit,page,keyword)
            if(list && list.EC === 0)
            {
                setListUsers(list.DT.data)
                setTotalPages(list.DT.totalPages)
                setType("")
                setSort("")   
            }
        }
        else {
           getUsers()
        }
    }

    const filterUsers = async () => {
        if(type) {
            let list = await fetchFilterUser(limit,page,type)
            if(list && list.EC === 0)
            {
                setListUsers(list.DT.data)
                setTotalPages(list.DT.totalPages)
                setKeyword("")   
            }
        }
        else {
            getUsers()
        }
    }

    const handleChangeLimit = async ()=> {
        if(limit) {
            setLimit(limit)
            await getUsers()
        }
    }

    const handleRefresh = async () => {
        await getUsers()
    }

    const deleteUser = async () => {
        let response = await fetchDeleteUser(dataDelete)
        if(response && +response.EC === 0) {
            toast.success(response.EM)
            await getUsers()
            handleClose()
        }
        else {
            toast.error(response.EM)
            handleClose()
        }
    }
    return (
        <>
        <div className='container'>
            <h4><FormattedMessage id="menu.system.system-administrator.user-manage"/></h4>
            <div className='row mb-3'>
                <div className='form-group col-12 mt-3 col-sm-2'>
                    <div className='d-flex'>
                        <button onClick={()=>handleCreate()} className='btn btn-warning text-white'><i className="fa-solid fa-user-plus"></i></button>
                        <button onClick={()=>handleRefresh()} className='btn btn-success text-white refresh'><i className="fa-solid fa-arrows-rotate"></i></button>
                    </div>
                </div>
                <div className='form-group col-12 mt-3 col-sm-3'>
                    <div className='d-flex'>
                    <select className="form-select d-inline-block w-25" id="limit" name="limit" value={limit} onChange={(event)=>setLimit(event.target.value)}> 
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                    </select>
                    <button className="btn btn-primary text-white" type="submit" onClick={()=>handleChangeLimit()}><FormattedMessage id="common.record"/></button>
                </div>
                </div>
                <div className='form-group col-12 mt-3 col-sm-3'>
                <div className='d-flex'>
                    <select className="form-select" id="type" name="type" value={type} onChange={(event)=>setType(event.target.value)}> 
                        {
                            props.lang === Languages.VI ?
                            <>
                            <option value="">Tất cả</option>
                            <option value="1">Quản trị viên</option>
                            <option value="2">Bác sỹ</option>
                            <option value="3">Nhân viên</option>
                            <option value="4">Bệnh nhân</option>
                            </>
                            :
                            <>
                            <option value="">All</option>
                            <option value="1">Admin</option>
                            <option value="2">Doctor</option>
                            <option value="3">Staff</option>
                            <option value="4">Patient</option>
                            </>
                        }
                    </select>
                    <button className="btn btn-danger text-white" type="submit" onClick={()=>handleFilter()}><FormattedMessage id="common.filter"/></button>
                </div>
                </div>
                <div className='form-group col-12 mt-3 col-sm-4'>
                    <div className='d-flex'>    
                        <input onKeyPress={(event)=>handlePressEnter(event)} className="form-control mr-sm-2" type="search" name="keyword" value={keyword} onChange={(event)=>setKeyword(event.target.value)} placeholder={props.lang === Languages.VI ? "Tìm tên": "Search name"} aria-label="Search"/>
                        <button className="btn btn-success text-white" type="submit" onClick={()=>handleSearch()}><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
            <table className="table table-bordered">
            <thead className='table table-light'>
                <tr>
                <th scope="col">ID </th>
                <th scope="col"><i className="fa-solid fa-users"></i> <FormattedMessage id="system.user-manage.name"/></th>
                <th scope="col"><i className="fa-solid fa-venus-mars"></i> <FormattedMessage id="system.user-manage.gender"/></th>
                <th scope="col"><i className="fa-solid fa-phone"></i> <FormattedMessage id="system.user-manage.mobile"/></th>
                <th scope="col"><i className="fa-solid fa-location-dot"></i> <FormattedMessage id="system.user-manage.address"/></th>
                <th scope="col"><i className="fa-solid fa-envelope"></i> <FormattedMessage id="system.user-manage.email"/></th>
                <th scope="col"><i className="fa-solid fa-hand"></i> <FormattedMessage id="system.user-manage.usertype"/></th>
                <th scope="col"><i className="fa-solid fa-briefcase"></i> <FormattedMessage id="system.user-manage.position"/></th>
                <th scope="col"><i className="fa-solid fa-gear"></i> <FormattedMessage id="system.user-manage.option"/></th>
                </tr>
            </thead>
            <tbody>
                <>
                {listUsers && listUsers.length > 0 ? 
                    <>
                    {listUsers.map((item, index)=>{
                        let roleVi = `${item.Role.valueVI}`,
                            roleEn = `${item.Role.valueEN}`,
                            positionVi = `${item.Position.valueVI}`,
                            positionEn = `${item.Position.valueEN}`,
                            genderVi = `${item.Gender.valueVI}`,
                            genderEn = `${item.Gender.valueEN}`
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
                                <td>{item.phone}</td>
                                <td>{item.address}</td>
                                <td>{item.email}</td>
                                <td>
                                    {
                                        item.roleId === roleUsers.PATIENT ?
                                        <>
                                        {
                                            props.lang === Languages.VI ?
                                            "Bệnh nhân"
                                            :
                                            "Patient"
                                        }
                                        </>
                                        :
                                        props.lang === Languages.VI ?
                                        roleVi
                                        :
                                        roleEn
                                    }
                                </td>
                                <td>
                                    {
                                        props.lang === Languages.VI ?
                                        positionVi
                                        :
                                        positionEn
                                    }
                                </td>
                                <td>
                                    <div className='d-flex alin-item-center justify-content-between'>
                                        <button onClick={()=>handleEdit(item)} className='btn btn-primary w-100' style={{marginRight:8}}><i className="fa-solid fa-pen"></i></button>
                                        <button onClick={()=>handleDelete(item)} className='btn btn-danger w-100'><i className="fa-solid fa-trash-can"></i></button>
                                    </div>
                                </td>
                            </tr>
                        )
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
        <Create_Edit_User
        showCreate={showCreate} 
        handleClose={handleClose}
        getUsers={getUsers}
        dataUpdate={dataUpdate}
        actionModalUser={actionModalUser}  
        />
        <Delete_User
        showDelete={showDelete} 
        handleClose={handleClose}
        dataDelete={dataDelete}
        deleteUser = {deleteUser}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
