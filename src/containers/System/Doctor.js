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

const Doctor = (props) => {
    let [selectedDocOption, setSelectedDocOption] = useState(null);
    let [selectedSpeOption, setSelectedSpeOption] = useState(null);
    let [selectedCliOption, setSelectedCliOption] = useState(null);
    let [selectedProOption, setSelectedProOption] = useState(null);
    let [selectedPriOption, setSelectedPriOption] = useState(null);
    let [selectedPayOption, setSelectedPayOption] = useState(null);
    let [selectedStaOption, setSelectedStaOption] = useState(null);
    
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
        selectedStaf: '',
        note: '',
        roleId: props.userRedux.roleId,
        existData: false
    }

    const [doctorData,setDataDoctor] = useState(dataDefault)
    const [listCli,setListCli] = useState([])
    const [listDoc,setListDoc] = useState([])
    const [listSpe,setListSpe] = useState([])
    const [listPro,setListPro] = useState([])
    const [listPay,setListPay] = useState([])
    const [listPri,setListPri] = useState([])
    const [listSta,setListSta] = useState([])

    
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

    // const getDetailDoctor = async (DoctorId) => {
    //     let res = await fetchDetailDoctor(DoctorId)
    //     let newDoctorData = _.cloneDeep(doctorData)
    //     if(res && res.EC === 0) {
    //         if(res.DT) {
    //             let SelectedSpec = '',SelectedPrice = '', SelectedPay = '', SelectedProv = '',SelectedClin='',
    //             SelectedStaf, Note ='', ContentMarkdown = '', 
    //             ContentHTML = '', Description = ''
    //             if (res.DT && res.DT.Doctor_Infor) {
    //                 // NameClinic = res.DT.Doctor_Infor.nameClinic
    //                 // AddressClinic = res.DT.Doctor_Infor.addressClinic
    //                 Note = res.DT.Doctor_Infor.note
    //                 Description = res.DT.Doctor_Infor.description
    //                 ContentHTML = res.DT.Doctor_Infor.contentHTML
    //                 ContentMarkdown = res.DT.Doctor_Infor.contentMarkdown

    //                 SelectedPrice = listPri.find(item => {
    //                     return item && item.value === res.DT.Doctor_Infor.priceId
    //                 })
    //                 SelectedPay = listPay.find(item => {
    //                     return item && item.value === res.DT.Doctor_Infor.paymentId
    //                 })
    //                 SelectedProv = listPro.find(item => {
    //                     return item && item.value === res.DT.Doctor_Infor.provinceId
    //                 })
    //                 SelectedSpec = listSpe.find(item => {
    //                     return item && item.value === res.DT.Doctor_Infor.specialityId
    //                 })
    //                 SelectedClin = listCli.find(item => {
    //                     return item && item.value === res.DT.Doctor_Infor.clinicId
    //                 })
    //                 SelectedStaf = listSta.find(item => {
    //                     return item && item.value === res.DT.Doctor_Infor.staffId
    //                 })
    //             }
    //             setSelectedCliOption(SelectedClin)
    //             setSelectedPriOption(SelectedPrice)
    //             setSelectedPayOption(SelectedPay)
    //             setSelectedProOption(SelectedProv)
    //             setSelectedSpeOption(SelectedSpec)
    //             setSelectedStaOption(SelectedStaf)
    //             setDataDoctor({
    //             ...newDoctorData,
    //             doctorId: DoctorId,
    //             contentMarkdown: ContentMarkdown,
    //             contentHTML: ContentHTML,
    //             description: Description,
    //             selectedPrice: SelectedPrice.value,
    //             selectedSpec: SelectedSpec.value,
    //             selectedClin: SelectedClin.value,
    //             selectedPay: SelectedPay.value,
    //             selectedProv: SelectedProv.value,
    //             selectedStaf: SelectedStaf?.value, 
    //             note: Note,
    //             existData: true
    //             })
    //         }
    //         else {
    //         setDataDoctor({...dataDefault,doctorId: DoctorId})
    //         setSelectedCliOption('')
    //         setSelectedPriOption('')
    //         setSelectedPayOption('')
    //         setSelectedProOption('')
    //         setSelectedSpeOption('')
    //         setSelectedStaOption('')
    //         }
    //     }
    //     else {
    //         setDataDoctor(dataDefault)
    //         setSelectedCliOption('')
    //         setSelectedPriOption('')
    //         setSelectedPayOption('')
    //         setSelectedProOption('')
    //         setSelectedSpeOption('')
    //         setSelectedStaOption('')
    //     }
    // }

    const getDetailDoctor = async (DoctorId) => {
        let res = await fetchDetailDoctor(DoctorId);
        let newDoctorData = _.cloneDeep(doctorData);
        if (res && res.EC === 0) {
            if (res.DT && res.DT.Doctor_Infor) { // Kiểm tra tồn tại của res.DT.Doctor_Infor trước
                let SelectedSpec = '',
                    SelectedPrice = '',
                    SelectedPay = '',
                    SelectedProv = '',
                    SelectedClin = '',
                    SelectedStaf,
                    Note = '',
                    ContentMarkdown = '',
                    ContentHTML = '',
                    Description = '';
                Note = res.DT.Doctor_Infor.note;
                Description = res.DT.Doctor_Infor.description;
                ContentHTML = res.DT.Doctor_Infor.contentHTML;
                ContentMarkdown = res.DT.Doctor_Infor.contentMarkdown;
    
                SelectedPrice = listPri.find(item => item && item.value === res.DT.Doctor_Infor.priceId);
                SelectedPay = listPay.find(item => item && item.value === res.DT.Doctor_Infor.paymentId);
                SelectedProv = listPro.find(item => item && item.value === res.DT.Doctor_Infor.provinceId);
                SelectedSpec = listSpe.find(item => item && item.value === res.DT.Doctor_Infor.specialityId);
                SelectedClin = listCli.find(item => item && item.value === res.DT.Doctor_Infor.clinicId);
                SelectedStaf = listSta.find(item => item && item.value === res.DT.Doctor_Infor.staffId);
    
                setSelectedCliOption(SelectedClin);
                setSelectedPriOption(SelectedPrice);
                setSelectedPayOption(SelectedPay);
                setSelectedProOption(SelectedProv);
                setSelectedSpeOption(SelectedSpec);
                setSelectedStaOption(SelectedStaf);
                setDataDoctor({
                    ...newDoctorData,
                    doctorId: DoctorId,
                    contentMarkdown: ContentMarkdown,
                    contentHTML: ContentHTML,
                    description: Description,
                    selectedPrice: SelectedPrice.value,
                    selectedSpec: SelectedSpec.value,
                    selectedClin: SelectedClin.value,
                    selectedPay: SelectedPay.value,
                    selectedProv: SelectedProv.value,
                    selectedStaf: SelectedStaf?.value,
                    note: Note,
                    existData: true
                });
            } else {
                setDataDoctor({ ...dataDefault, doctorId: DoctorId, existData: false });
                setSelectedCliOption('');
                setSelectedPriOption('');
                setSelectedPayOption('');
                setSelectedProOption('');
                setSelectedSpeOption('');
                setSelectedStaOption('');
            }
        } else {
            setDataDoctor(dataDefault);
            setSelectedCliOption('');
            setSelectedPriOption('');
            setSelectedPayOption('');
            setSelectedProOption('');
            setSelectedSpeOption('');
            setSelectedStaOption('');
        }
    };
    
    
    const getList = async () => {
        setListCli(getAllSpeciality(props.reduxDoctorRequired.CliRes))
        setListSpe(getAllSpeciality(props.reduxDoctorRequired.SpeRes))
        setListPay(getAllRequired(props.reduxDoctorRequired.PayRes))
        setListPro(getAllRequired(props.reduxDoctorRequired.ProRes))
        setListPri(getAllRequired(props.reduxDoctorRequired.PriRes))
        setListSta(getAllDoctor(props.reduxDoctorRequired.StaRes))
        if(doctorData.roleId === roleUsers.ADMIN) {
            setListDoc(getAllDoctor(props.reduxDoctor))
        }
        else {
            let res = await fetchGetDoctorById(props.userRedux.id)
            if(res && res.EC === 0) {
                setListDoc(getAllDoctor(res.DT))
            }
        }
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

    const getAllDoctor = (data) => {
        let result = []
        if(data && data.length > 0) {
            data.map((item,index)=> {
                let object = {},
                    positionVi = '',
                    positionEn = ''
                if(item.Position) {
                    positionVi = item.Position.valueVI
                    positionEn = item.Position.valueEN
                }
                object.label = props.lang === Languages.VI ? `${index + 1} - ${positionVi} ${item.fullName}` : `${index + 1} - ${positionEn} ${item.fullName}`
                object.value = item.id
                result.push(object)
            })
        }
        return result
    }

    const handleEditorChange = ({ html, text }) => {
        setDataDoctor({
            ...doctorData,
            contentHTML: html,
            contentMarkdown: text
        })
    }

    const handleSelect = (item, selectType) => {
        switch (selectType) { 
          case 'selectedDoc': 
                setSelectedDocOption(item)
                if(props.userRedux.roleId === roleUsers.ADMIN) {
                    getDetailDoctor(item.value)
                }
                else {
                    getDetailDoctor(props.userRedux.id)
                }
                break;       
          case 'selectedSpec':
            setSelectedSpeOption(item)
            setDataDoctor({...doctorData,selectedSpec:item.value})
            break;
          case 'selectedClin':
            setSelectedCliOption(item)
            setDataDoctor({...doctorData,selectedClin:item.value})
            break;
          case 'selectedPrice':
            setSelectedPriOption(item)
            setDataDoctor({...doctorData,selectedPrice:item.value})
            break;
          case 'selectedPay':
            setSelectedPayOption(item)
            setDataDoctor({...doctorData,selectedPay:item.value})
            break;
          case 'selectedProv':
            setSelectedProOption(item)
            setDataDoctor({...doctorData,selectedProv:item.value})
            break;
        case 'selectedStaf':
            setSelectedStaOption(item)
            setDataDoctor({...doctorData,selectedStaf:item.value})
            break; 
          default:
            break;
        }
      };

    const handleCancel = () => {
        setDataDoctor(dataDefault)
        setSelectedCliOption('')
        setSelectedDocOption('')
        setSelectedPriOption('')
        setSelectedPayOption('')
        setSelectedProOption('')
        setSelectedSpeOption('')
        setSelectedStaOption('')
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
        setDataDoctor(dataDefault)
        setSelectedCliOption('')
        setSelectedDocOption('')
        setSelectedPriOption('')
        setSelectedPayOption('')
        setSelectedProOption('')
        setSelectedSpeOption('')
        setSelectedStaOption('')
    }

    return (
        <>
        {
            props.userRedux && props.userRedux.roleId !== roleUsers.STAFF ?
            <>
            <div className="Manage-doctor">
                <div className='container'>
                    <h4><FormattedMessage id="menu.system.system-administrator.doc-manage"/></h4>
                    <div className='row'>
                        <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-doc"/>:</label>
                            <Select className="form-select"
                            value={selectedDocOption}
                            onChange={(item) => handleSelect(item,'selectedDoc')}
                            options={listDoc}
                            placeholder={<FormattedMessage id="system.product-manage.choose-doc"/>}
                            />
                        </div>
                        <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-speciality"/>:</label>
                            <Select className="form-select"
                            value={selectedSpeOption}
                            onChange={(item) => handleSelect(item, 'selectedSpec')}
                            options={listSpe}
                            placeholder={<FormattedMessage id="system.product-manage.choose-speciality"/>}
                            />
                        </div>
                        <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-clinic"/>:</label>
                            <Select className="form-select"
                            value={selectedCliOption}
                            onChange={(item) => handleSelect(item, 'selectedClin')}
                            options={listCli}
                            placeholder={<FormattedMessage id="system.product-manage.choose-clinic"/>}
                            />
                        </div>
                        <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-price"/>:</label>
                            <Select className="form-select"
                            value={selectedPriOption}
                            onChange={(item) => handleSelect(item, 'selectedPrice')}
                            options={listPri}
                            placeholder={<FormattedMessage id="system.product-manage.price"/>}
                            />
                        </div>
                        <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-pay"/>:</label>
                            <Select className="form-select"
                            value={selectedPayOption}
                            onChange={(item) => handleSelect(item, 'selectedPay')}
                            options={listPay}
                            placeholder={<FormattedMessage id="system.product-manage.method-pay"/>}
                            />
                        </div>
                        <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.choose-province"/>:</label>
                            <Select className="form-select"
                            value={selectedProOption}
                            onChange={(item) => handleSelect(item, 'selectedProv')}
                            options={listPro}
                            placeholder={<FormattedMessage id="system.product-manage.choose-province"/>}
                            />
                        </div>
                        {/* <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.name-clinic"/>:</label>
                            <input type='text' className="form-control" onChange={(event)=>handleChangeInput(event.target.value,'nameClinic')} value= {doctorData.nameClinic} id="Clinic" placeholder={props.lang === Languages.VI ? "Tên phòng khám": "Name clinic"}/>
                        </div>
                        <div className="form-group col-12 col-sm-4">
                            <label className='text-justify'><FormattedMessage id="system.product-manage.address-clinic"/>:</label>
                            <input type='text' className="form-control" onChange={(event)=>handleChangeInput(event.target.value,'addressClinic')} value= {doctorData.addressClinic} id="Clinic address" placeholder={props.lang === Languages.VI ? "Địa chỉ phòng khám": "Address clinic"}/>
                        </div> */}
                        {
                            props.userRedux.roleId === roleUsers.ADMIN &&
                            <div className="form-group col-12">
                                <label className='text-justify'><FormattedMessage id="system.product-manage.choose-staff"/>:</label>
                                <Select className="form-select"
                                value={selectedStaOption}
                                onChange={(item) => handleSelect(item, 'selectedStaf')}
                                options={listSta}
                                placeholder={<FormattedMessage id="system.product-manage.choose-staff"/>}
                                />
                            </div>
                        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);