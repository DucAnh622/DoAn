import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchCreateUser, fetchUpdateUser} from '../../services/userService';
import { fetchRole, fetchGender, fetchPosition} from '../../services/generalService';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Languages } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";
import _ from 'lodash';
import * as actions from "../../store/actions";
import { Lightbox } from "react-modal-image";
import { Buffer } from 'buffer';
import { CommonUtils } from "../../utils";
import './Create_Edit.scss';

const Create_Edit_User = (props) => {
    const dataDefault = {
        fullName: '',
        genderId: '',
        phone: '',
        address: '',
        email: '',
        roleId: '',
        positionId: '',
        password: '',
        image: ''
    }

    const defaultCheck = {
        fullName: true,
        genderId: true,
        phone: true,
        address: true,
        email: true,
        roleId: true,
        positionId: true,
        password: true,
        image: true
    }

    const [userData,setUserData] = useState(dataDefault)
    const [checkInput,setCheckInput] = useState(defaultCheck)
    const [listGender,setListGender] = useState([])
    const [listRole,setListRole] = useState([])
    const [listPosition,setListPosition] = useState([])
    const [preview,setPreview] = useState("")
    const [show,setShow] = useState(false)

    const fetchData = async()=> {
        let resGe = await fetchGender()
        if(resGe && resGe.EC === 0) {
            setListGender(resGe.DT)
        }
        let resPo = await fetchPosition()
        if(resPo && resPo.EC === 0) {
            setListPosition(resPo.DT)
        }
        let resRo = await fetchRole()
        if(resRo && resRo.EC === 0) {
            setListRole(resRo.DT)
        }
    }

    useEffect(()=>{
        fetchData()
    },[])

    const handleChangeInput = (value,name) => {
        let _userData = _.cloneDeep(userData)
        _userData[name]= value
        setUserData(_userData)
        setCheckInput(defaultCheck)
    }

    const validate = () => {
        setCheckInput(defaultCheck)
        let check = true

        if(props.actionModalUser === "UPDATE") {
            return true
        }

        let arr = ['fullName','genderId','phone','address','email','password','roleId','positionId']
        for(let i = 0; i < arr.length; i++ ) {
            if(!userData[arr[i]]) {
                let _checkInput = _.cloneDeep(defaultCheck)
                _checkInput[arr[i]] = false
                setCheckInput(_checkInput)
                check = false
                toast.error(props.lang === Languages.VI ? 'Dữ liệu nhập trống!' : 'Invalid input!')
                break
            }
        }

        if(userData.password && userData.password.length < 3) {
            check = false
            toast.error(props.lang === Languages.VI ? 'Mật khẩu tối thiểu 3 kí tự!' : 'Password must be longer than 3!')
            setCheckInput({...checkInput,password:false})
        }

        let regex = /\S+@\S+\.\S+/

        if (userData.email && !regex.test(userData.email)) {
            toast.error(props.lang === Languages.VI ? 'Sai định dạng email!' : 'The wrong email!')
            check = false
            setCheckInput({...checkInput,email:false})
        }

        return check
    }

    const handleCloseModal = () => {
        props.handleClose()
        setUserData(dataDefault)
        setCheckInput(defaultCheck)
        setPreview("")
        setShow(false)
    }

    const handleCreate = async () => {
        let check = validate()
        if(check === true) {
            let response = ""
            if(props.actionModalUser === "CREATE") {
               response = await fetchCreateUser(userData)
            }
            else {
                response = await fetchUpdateUser(userData) 
            }
            if(response && response.EC === 0 ) {
                toast.success(response.EM)
                if(props.userRedux.id === response.DT.id) {
                    props.accountUpdateSuccess(response.DT)
                }
                await props.getUsers()
            }
            if(response && response.EC !== 0) {
                toast.error(response.EM)
                let _checkInput = _.cloneDeep(defaultCheck)
                _checkInput[response.DT] = false
                setCheckInput(_checkInput)  
            }
            props.handleClose()
            setUserData(dataDefault)
            setCheckInput(defaultCheck)
            setPreview("")
            setShow(false)
        }
    }

    const handleChangeImg = async (event) => {
        let src = event.target.files
        let file = src[0]
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            console.log("Check",base64)
            let objectURL = URL.createObjectURL(file)
            setPreview(objectURL)
            setUserData({...userData, image: base64})
        }
    }

    useEffect(()=>{
        if(props.actionModalUser === "UPDATE") {
            let imageURL = ''
            if(props.dataUpdate.image) {
                imageURL = new Buffer(props.dataUpdate.image,'base64').toString('binary')
                setUserData({...props.dataUpdate, image: imageURL})
                setPreview(imageURL)
            }
            else {
                setUserData(props.dataUpdate)
            }
        }
    },[props.dataUpdate])

    return (
        <>
        <Modal show={props.showCreate} data-theme="Li" onHide={()=>handleCloseModal()} centered>
            <Modal.Header closeButton>
            <Modal.Title>{props.actionModalUser === "CREATE" ? <FormattedMessage id="system.user-manage.add-user"/> : <FormattedMessage id="system.user-manage.edit-user"/>}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form>
                <div className='row'>
                    <div className="form-group col-12 col-sm-6">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.fullname"/>: (<span style={{color:"red"}}>*</span>)</label>
                        <input type="text" className={checkInput.fullName ? "form-control" : "form-control is-invalid"} id="username" placeholder={props.lang === Languages.VI ? "Tên tài khoản" : "Username"}  value={userData.fullName}  onChange={(event)=>handleChangeInput(event.target.value,'fullName')}/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.mobile"/>: (<span style={{color:"red"}}>*</span>)</label>
                        <input style={props.actionModalUser === "UPDATE" ? {backgroundColor:"#ccc"}: {}} type="number" disabled={props.actionModalUser === "CREATE" ? false : true} className={checkInput.phone ? "form-control" : "form-control is-invalid"} id="Phone" placeholder={props.lang === Languages.VI ? "Điện thoại" : "Phone"} value={userData.phone} onChange={(event)=>handleChangeInput(event.target.value,'phone')}/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.gender"/>:</label>
                        <select className={checkInput.genderId ? "form-select" : "form-select is-invalid"} id="gender" name="gender" value={userData.genderId} onChange={(event)=>handleChangeInput(event.target.value,'genderId')}>
                        <option>{props.lang === Languages.VI ? "Chọn" : "Choose"}</option>
                        {listGender && listGender.length > 0 &&
                            listGender.map((item,index)=>{
                                return(
                                    <option key={index} value={item.id}>{props.lang === Languages.VI ? item.valueVI : item.valueEN}</option>
                                )
                            })
                        }
                        </select>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.usertype"/>:</label>
                        <select className={checkInput.roleId ? "form-select" : "form-select is-invalid"} id="gender" name="gender" value={userData.roleId} onChange={(event)=>handleChangeInput(event.target.value,'roleId')}>
                        <option>{props.lang === Languages.VI ? "Chọn" : "Choose"}</option>
                        {listRole && listRole.length > 0 &&
                            listRole.map((item,index)=>{
                                return(
                                    <option key={index} value={item.id}>{props.lang === Languages.VI ? item.valueVI : item.valueEN}</option>
                                )
                            })
                        }
                        </select>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.position"/>:</label>
                        <select className={checkInput.positionId ? "form-select" : "form-select is-invalid"} id="positionId" name="positionId" value={userData.positionId} onChange={(event)=>handleChangeInput(event.target.value,'positionId')}>
                        <option>{props.lang === Languages.VI ? "Chọn" : "Choose"}</option>
                        {listPosition && listPosition.length > 0 &&
                            listPosition.map((item,index)=>{
                                return(
                                    <option key={index} value={item.id}>{props.lang === Languages.VI ? item.valueVI : item.valueEN}</option>
                                )
                            })
                        }
                        </select>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.address"/>:</label>
                        <input type="text" className={checkInput.address ? "form-control" : "form-control is-invalid"} id="address" placeholder={props.lang === Languages.VI ? "Địa chỉ" : "Address"}  value={userData.address} onChange={(event)=>handleChangeInput(event.target.value,'address')}/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.email"/>: (<span style={{color:"red"}}>*</span>)</label>
                        <input style={props.actionModalUser === "UPDATE" ? {backgroundColor:"#ccc"}: {}} type="email" disabled={props.actionModalUser === "CREATE" ? false : true} className={checkInput.email ? "form-control" : "form-control is-invalid"} id="email" placeholder="Email"  value={userData.email} onChange={(event)=>handleChangeInput(event.target.value,'email')}/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.password"/>:</label>
                        <input style={props.actionModalUser === "UPDATE" ? {backgroundColor:"#ccc"}: {}} type="password" disabled={props.actionModalUser === "CREATE" ? false : true} className={checkInput.password ? "form-control" : "form-control is-invalid"} id="password" placeholder={props.lang === Languages.VI ? "Mật khẩu" : "Password"} value={userData.password} onChange={(event)=>handleChangeInput(event.target.value,'password')}/>
                    </div>
                    <div className="form-group col-12">
                        <label className='text-justify'><FormattedMessage id="system.user-manage.image"/>:</label>
                        <div className='d-flex'>
                        <span className='btn btn-success text-white'><label htmlFor="Image" className='text-justify'><i className="fa-solid fa-upload"></i></label></span>    
                        <input hidden type="file" className="form-control" id="Image" placeholder="Image" onChange={(event)=>handleChangeImg(event)}/>
                        <div style={{backgroundImage: `url(${preview})`}} className='preview' onClick={preview ? ()=>setShow(true) : () => {}}>
                        {
                            show === true &&
                            <Lightbox medium={preview} onClose={() => setShow(false)}/>
                        }
                        </div>
                        </div>
                    </div>
                </div>
            </form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={()=>handleCloseModal()}>
                <FormattedMessage id="common.cancel"/>
            </Button>
            <Button variant="primary" onClick={()=>handleCreate()}>
                {props.actionModalUser === "CREATE" ? <FormattedMessage id="common.save"/> : <FormattedMessage id="common.edit"/>}
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        userRedux: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        accountUpdateSuccess: (userData)=>dispatch(actions.accountUpdateSuccess(userData)),
        accountUpdateFail: ()=>dispatch(actions.accountUpdateFail())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Create_Edit_User);