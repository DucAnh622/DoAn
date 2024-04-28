import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Languages, manageActions, roleUsers } from "../../utils/constant";
import { appChangeLanguage } from "../../store/actions/appActions";
import * as actions from "../../store/actions";
import _ from 'lodash';
import { toast } from 'react-toastify';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import '../System/Doctor.scss';
import Select from 'react-select';
import { fetchCreateDoctorInfo, fetchDetailDoctor, fetchGetDoctorById } from '../../services/doctorService';
import Dashboard from './Dashboard';
const mdParser = new MarkdownIt();

const DoctorManage = (props) => {  
    const dataDefault = {
        contentMarkdown: '',
        contentHTML: '',
        description: '',
        doctorId: '',
        selectedPrice: '',
        selectedSpec: '',
        selectedClin: '',
        selectedPay: '',
        selectedProv: '',
        note: '',
        roleId: props.userRedux.roleId,
        existData: false
    }

    const [doctorData,setDataDoctor] = useState(dataDefault)
    const [listCli,setListCli] = useState([])
    const [listSpe,setListSpe] = useState([])
    const [listPro,setListPro] = useState([])
    const [listPay,setListPay] = useState([])
    const [listPri,setListPri] = useState([])
    const [isLoading,setLoading] = useState(true)

    const fetchList = () => {
        props.reduxFetchDoctorRequired()
        props.reduxFetchDoctor()
    } 

      
    useEffect(() => {
        fetchList()
    }, [])
    
    useEffect(() => {
        getList()
    }, 
    [
        props.reduxDoctorRequired.CliRes,
        props.reduxDoctorRequired.SpeRes,
        props.reduxDoctorRequired.PriRes,
        props.reduxDoctorRequired.PayRes,
        props.reduxDoctorRequired.ProRes,
        props.reduxDoctorRequired.StaRes,
        props.reduxDoctor,
        props.lang
    ])

    const getList = async () => {
        setListCli(getAllSpeciality(props.reduxDoctorRequired.CliRes))
        setListSpe(getAllSpeciality(props.reduxDoctorRequired.SpeRes))
        setListPay(getAllRequired(props.reduxDoctorRequired.PayRes))
        setListPro(getAllRequired(props.reduxDoctorRequired.ProRes))
        setListPri(getAllRequired(props.reduxDoctorRequired.PriRes))
    }

    const getAllRequired = (data) => {
        let result = []
        if(data && data.length > 0) {
            data.map((item,index)=> {
                let object = {}
                object.label = props.lang === Languages.VI ? item.valueVI : item.valueEN
                object.value = item.id
                result.push(object)
            })
        }
        return result
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

    const handleChangeInput = (value,name) => {
        let _doctorData = _.cloneDeep(doctorData)
        _doctorData[name]= value
        setDataDoctor(_doctorData)
    }

    const handleEditorChange = ({ html, text }) => {
        setDataDoctor({
            ...doctorData,
            contentHTML: html,
            contentMarkdown: text
        })
    }

    const handleCancel = () => {
        if(props.userRedux && props.userRedux.roleId === roleUsers.DOCTOR) {
            getDetailDoctor(props.userRedux.id)
        }
    }  

    const handleCreate = async () => {
        let res = await fetchCreateDoctorInfo({
            ...doctorData,
            action: doctorData.existData === true ? manageActions.EDIT : manageActions.CREATE
        })
        if(res && res.EC === 0) {
            toast.success(res.EM)
        }
        else {
            toast.error(res.EM)
        }
        if(props.userRedux && props.userRedux.roleId === roleUsers.DOCTOR) {
            getDetailDoctor(props.userRedux.id)
        }
    }

    const getDetailDoctor = async (DoctorId) => {
        let res = await fetchDetailDoctor(DoctorId),
            newDoctorData = _.cloneDeep(doctorData);
        if(res && res.EC === 0) {
            if (res.DT && res.DT.Doctor_Infor) { 
                setDataDoctor({
                    ...newDoctorData,
                    doctorId: DoctorId,
                    contentMarkdown: res.DT.Doctor_Infor.contentMarkdown,
                    contentHTML: res.DT.Doctor_Infor.contentHTML,
                    description: res.DT.Doctor_Infor.description,
                    selectedPrice: res.DT.Doctor_Infor.priceId,
                    selectedSpec: res.DT.Doctor_Infor.specialityId,
                    selectedClin: res.DT.Doctor_Infor.clinicId,
                    selectedPay: res.DT.Doctor_Infor.paymentId,
                    selectedProv: res.DT.Doctor_Infor.provinceId,
                    note: res.DT.Doctor_Infor.note,
                    existData: true
                });
            }
            else {
                setDataDoctor({...doctorData,doctorId: DoctorId, existData: false})
            }
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(props.userRedux && props.userRedux.roleId === roleUsers.DOCTOR) {
            getDetailDoctor(props.userRedux.id)
        }
    },[props.userRedux])

    return (
        <>
        {
            props.userRedux && props.userRedux.roleId !== roleUsers.STAFF ?
            <>
            {
                isLoading === true ?
                <div className="circle-loading"></div>
                :
                <div className="Manage-doctor">
                <div className='container'>
                    <h4><FormattedMessage id="menu.system.system-administrator.doc-manage"/></h4>
                    <div className='row'>
                        <div className="form-group col-12 col-sm-6">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-speciality"/>:</label>
                            <select className="form-select" id="spe" name="spe" value={doctorData.selectedSpec} onChange={(e)=>handleChangeInput(e.target.value,"selectedSpec")}>
                            <option>{props.lang === Languages.VI ? "Chọn" : "Choose"}</option>
                            {listSpe && listSpe.length > 0 &&
                                listSpe.map((item,index)=>{
                                    return(
                                        <option key={index} value={item.value}>{item.label}</option>
                                    )
                                })
                            }
                            </select>
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-clinic"/>:</label>
                            <select className="form-select" id="cli" name="cli" value={doctorData.selectedClin} onChange={(e)=>handleChangeInput(e.target.value,"selectedClin")}>
                            <option>{props.lang === Languages.VI ? "Chọn" : "Choose"}</option>
                            {listCli && listCli.length > 0 &&
                                listCli.map((item,index)=>{
                                    return(
                                        <option key={index} value={item.value}>{item.label}</option>
                                    )
                                })
                            }
                            </select>
                        </div>
                        <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-price"/>:</label>
                            <select className="form-select" id="pri" name="pri" value={doctorData.selectedPrice} onChange={(e)=>handleChangeInput(e.target.value,"selectedPrice")}>
                            <option>{props.lang === Languages.VI ? "Chọn" : "Choose"}</option>
                            {listPri && listPri.length > 0 &&
                                listPri.map((item,index)=>{
                                    return(
                                        <option key={index} value={item.value}>{item.label}</option>
                                    )
                                })
                            }
                            </select>
                        </div>
                        <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-pay"/>:</label>
                            <select className="form-select" id="pay" name="pay" value={doctorData.selectedPay} onChange={(e)=>handleChangeInput(e.target.value,"selectedPay")}>
                            <option>{props.lang === Languages.VI ? "Chọn" : "Choose"}</option>
                            {listPay && listPay.length > 0 &&
                                listPay.map((item,index)=>{
                                    return(
                                        <option key={index} value={item.value}>{item.label}</option>
                                    )
                                })
                            }
                            </select>
                        </div>
                        <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-province"/>:</label>
                            <select className="form-select" id="pro" name="pro" value={doctorData.selectedProv} onChange={(e)=>handleChangeInput(e.target.value,"selectedProv")}>
                            <option>{props.lang === Languages.VI ? "Chọn" : "Choose"}</option>
                            {listPro && listPro.length > 0 &&
                                listPro.map((item,index)=>{
                                    return(
                                        <option key={index} value={item.value}>{item.label}</option>
                                    )
                                })
                            }
                            </select>
                        </div>
                        <div className="form-group col-12">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-note"/>:</label>
                            <input type='text' className="form-control" onChange={(event)=>handleChangeInput(event.target.value,'note')} value= {doctorData.note} id="Note" placeholder={props.lang === Languages.VI ? "Ghi chú": "Note"}/>
                        </div>
                        <div className="form-group col-12">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.description"/>:</label>
                            <textarea className="form-control" onChange={(event)=>handleChangeInput(event.target.value,'description')} value= {doctorData.description} id="description" placeholder={props.lang === Languages.VI ? "Mô tả": "Description"} rows={4} cols={50}/>
                        </div>
                        <div className='form-group col-12 mt-2 mb-2'>
                            <MdEditor style={{ height: '300px' }} renderHTML={text => mdParser.render(text)} onChange={(html,text)=>handleEditorChange(html,text)} value={doctorData.contentMarkdown}/>
                        </div> 
                        <div className='form-group col-12 mt-2 mb-2'>
                        <button className="btn btn-primary" onClick={()=>handleCreate()}>
                            {doctorData.existData === true ?  <FormattedMessage id="common.edit"/> : <FormattedMessage id="common.create"/>}
                        </button>    
                        <button className='btn btn-danger' onClick={()=>handleCancel()}>
                            <FormattedMessage id="common.cancel"/>
                        </button>
                        </div>
                    </div>
                </div>
            </div>
            }
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
        reduxDoctor: state.admin.doctors,
        userRedux: state.user.userInfo,
        reduxDoctorRequired: state.admin.infoDoctor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxChangeLanguage: (language) => dispatch(appChangeLanguage(language)),
        reduxFetchDoctor: () => dispatch(actions.fetchDoctor()),
        // reduxCreateInfoDoctor: (data) => dispatch(actions.createInfoDoctor(data)),
        reduxFetchDoctorRequired: () => dispatch(actions.fetchDoctorRequiredStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
