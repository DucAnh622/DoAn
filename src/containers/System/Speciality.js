import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import * as actions from "../../store/actions";
import { Languages, dateFormat, roleUsers } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import '../System/Doctor.scss';
import 'react-markdown-editor-lite/lib/index.css';
import { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import { CommonUtils } from "../../utils";
import { fetchCreateSpeciality, fetchGetDetailSpeciality } from '../../services/specialityService';
import Select from 'react-select';
import { Buffer } from 'buffer';
import { Lightbox } from "react-modal-image";
import Delete_Hos_Spe from './Delete_Hos_Spe';
import Dashboard from '../System/Dashboard';

const mdParser = new MarkdownIt();

const Speciality = (props) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const dataDefault = {
        image: '',
        specialityId: '',
        speciality: '',
        Markdown: '',
        HTML: '',
        exist: false,
        type: 'Spe'
    }
    
    const defaultCheck = {
        speciality: true,
        image: true,
    }

    const [data,setData] = useState(dataDefault)
    const [checkInput,setCheckInput] = useState(defaultCheck)
    const [listSpe,setListSpe] = useState([])
    const [preview,setPreview] = useState("")
    const [show,setShow] = useState(false)
    const [checkCreate,setCheckCreate] = useState(false)
    const [showDelete,setShowDelete] = useState(false)

    const handleChangeInput = (event) => {
        setData({...data,speciality: event.target.value})
        setCheckInput(defaultCheck)
    }

    const fetchListSpe = () => {
        props.reduxFetchDoctorRequired()
    } 
      
    useEffect(() => {
        fetchListSpe()
    }, [])
    
    useEffect(() => {
        getListSpe()
    }, [props.reduxDoctorRequired.SpeRes])

    const getListSpe = () => {
        setListSpe(getAllSpeciality(props.reduxDoctorRequired.SpeRes))
    }

    const handleSelect = async (item) => {
        setSelectedOption(item);
        await getSpeDetail(item.value);
      };

    const getSpeDetail = async (specialityId) => {
        let res = await fetchGetDetailSpeciality(specialityId)
        if (res && res.EC === 0 && res.DT.descriptionMarkdown) {
            let imageURL = ''
            if(res.DT.image) {
                imageURL = new Buffer(res.DT.image,'base64').toString('binary')
                setPreview(imageURL)
            }
            setData({
                ...data,
                specialityId: res.DT.id,
                speciality: res.DT.name,
                Markdown: res.DT.descriptionMarkdown,
                HTML: res.DT.descriptionHTML,
                image: imageURL,
                exist: true
            })
        }
    }

    const getAllSpeciality = (data) => {
        let result = []
        if(data && data.length > 0) {
            data.map((item,index)=> {
                let object = {}
                object.label = `${index + 1} - ${item.name}`
                object.value = item.id
                result.push(object)
            })
        }
        return result
    }

    const validate = () => {
        setCheckInput(defaultCheck)
        let check = true
        let arr = []
        if(checkCreate === false) {
            arr = ['image']
        }
        else {
            arr = ['speciality','image']
        }
        for(let i = 0; i < arr.length; i++ ) {
            if(!data[arr[i]]) {
                let _checkInput = _.cloneDeep(defaultCheck)
                _checkInput[arr[i]] = false
                setCheckInput(_checkInput)
                check = false
                toast.error(props.lang === Languages.VI ? 'Dữ liệu nhập trống!' : 'Invalid input!')
                break
            }
        }
        return check
    }

    const handleEditorChange = ({ html, text }) => {
        setData({
            ...data,
            HTML: html,
            Markdown: text
        })
    }

    const handleChangeImg = async (event) => {
        let src = event.target.files
        let file = src[0]
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectURL = URL.createObjectURL(file)
            setPreview(objectURL)
            setData({
                ...data,image: base64
            })
        }
    }

    const handleCreate = async () => {
        let check = validate()
        if(check === true) {
            let _data = _.cloneDeep(data)
            if(selectedOption) {
                _data.specialityId = selectedOption.value
            }
            // console.log("check",_data)
            let res = await fetchCreateSpeciality(_data)
            if(res && res.EC === 0) {
                toast.success(res.EM)
            }
            else {
                toast.error(res.EM)
            }
            setListSpe([]);
            fetchListSpe();
            setData(dataDefault);
            setPreview("")
            setSelectedOption(null)
        }
    }

    const handleCancel = () => {
        setPreview("")
        setData(dataDefault);
        setSelectedOption(null)
        setCheckInput(defaultCheck)
        setShowDelete(false)
    }

    const handleCheckCreate = () => {
        setCheckCreate(!checkCreate)
        setData(dataDefault);
        setPreview("")
        setSelectedOption(null)
    }

    const handleDelete = () => {
        if(data.exist === true){
            setShowDelete(true)
        }
        else {
            toast.warning(props.lang === Languages.VI ? "Chưa chọn chuyên khoa!" : "Not choose speciality!" )
        }
    }

    return (
        <>
        {
            props.userRedux && props.userRedux.roleId === roleUsers.ADMIN ?
            <>
            <div className='Manage-doctor'>
                <div className='container'>
                    <div className='row'>
                        <div className='form-group col-12'>
                            <div className='d-flex align-items-center justify-content-between'>
                                <h4><FormattedMessage id={checkCreate === false ? "menu.system.system-administrator.spe-manage": "common.add speciality"}/></h4>
                                <div className='d-flex align-items-center '>
                                    <button onClick={()=>handleCheckCreate()} style={{marginRight:8}} className='btn btn-warning text-white'>{checkCreate === false ? <i className="fa-solid fa-plus"></i> : <FormattedMessage id="common.cancel"/>}</button>
                                    <button onClick={()=>handleDelete()} className='btn btn-danger text-white'><i className="fa-solid fa-trash-can"></i></button>
                                </div>
                            </div>
                        </div>
                        {
                            checkCreate === false 
                            &&
                            <div className="form-group col-12 col-sm-4">
                                <label className='text-justify'><FormattedMessage id="system.product-manage.choose-speciality"/>:</label>
                                <Select className="form-select"
                                value={selectedOption}
                                onChange={handleSelect}
                                options={listSpe}
                                placeholder={<FormattedMessage id="system.product-manage.choose-speciality"/>}
                                />
                            </div>
                        }
                        <div className={checkCreate === false ? "form-group col-12 col-sm-4": "form-group col-12 col-sm-6"}>
                            <label className='text-justify'><FormattedMessage id="Speciality.name"/>:</label>
                            <input type='text' value={data.speciality} onChange={(event)=>handleChangeInput(event)} className={checkInput.speciality ? "form-control" : "form-control is-invalid"} id="Speciality" placeholder={props.lang === Languages.VI ? "Tên chuyên khoa": "Speciality"}/>
                        </div>
                        <div className={checkCreate === false ? "form-group col-12 col-sm-4": "form-group col-12 col-sm-6"}>
                            <label className='text-justify'><FormattedMessage id="Speciality.img"/>:</label>
                            <div className='d-flex'>
                            <span className='btn btn-secondary text-white'><label htmlFor="Image" className='text-justify'><i className="fa-solid fa-upload"></i></label></span>    
                            <input hidden type="file" className="form-control" id="Image" placeholder="Image" onChange={(event)=>handleChangeImg(event)}/>
                            <div style={{backgroundImage: `url(${preview})`}} className='preview' onClick={preview ? ()=>setShow(true) : () => {}}>
                            {
                                show === true &&
                                <Lightbox medium={preview} onClose={() => setShow(false)}/>
                            }
                            </div>
                            </div>
                        </div>
                        <div className='form-group col-12 col-sm-6'></div>
                        <div className='form-group col-12 mt-2 mb-2'>
                            <MdEditor value={data.Markdown} onChange={(html,text)=>handleEditorChange(html,text)} style={{ height: '300px' }} renderHTML={text => mdParser.render(text)} />
                        </div>
                        <div className='form-group col-12 mt-2 mb-2'>
                            <button className="btn btn-primary" onClick={()=>handleCreate()}>
                                {
                                    data.exist === false  ?
                                    <FormattedMessage id="common.create"/>
                                    :
                                    <FormattedMessage id="common.edit"/>
                                }
                            </button>    
                            <button className='btn btn-danger' onClick={()=>handleCancel()}>
                                <FormattedMessage id="common.cancel"/>
                            </button>
                        </div>
                    </div>
                </div>
                <Delete_Hos_Spe
                showDelete={showDelete}
                data={data}
                handleCancel={handleCancel}
                fetchListSpe={fetchListSpe}
                />
            </div>
            </>
            :
            <Dashboard/>
        }
        </>
    )
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
        userRedux: state.user.userInfo,
        reduxDoctorRequired: state.admin.infoDoctor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxFetchDoctorRequired: () => dispatch(actions.fetchDoctorRequiredStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Speciality);