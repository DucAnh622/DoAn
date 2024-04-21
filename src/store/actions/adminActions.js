import actionTypes from './actionTypes';
import { toast } from 'react-toastify';
import {fetchGetDoctor, fetchCreateDoctorInfo, fetchDetailDoctor, fetchCreateSchedule  } from '../../services/doctorService';
import { fetchGetSpeciality } from '../../services/specialityService';
import { fetchGetClinic } from '../../services/clinicService';
import { fetchTime, fetchPosition, fetchGender, fetchRole, fetchProvince, fetchPayment, fetchPrice } from '../../services/generalService';
import { fetchGetStaff } from '../../services/userService';

export const fetchGenderStart = () => {
    return async (dispatch,getState) => {
        try {
            let res = await fetchGender()
            if(res && res.EC === 0) {
                dispatch(fetchGenderSuccess(res.DT))
            }
            else {
                dispatch(fetchGenderFailed())
            }
        }
        catch(e) {
            console.log("check error",e)
            dispatch(fetchGenderFailed())
        }
    }
}

export const fetchRoleStart = () => {
    return async (dispatch,getState) => {
        try {
            let res = await fetchRole()
            if(res && res.EC === 0) {
                dispatch(fetchRoleSuccess(res.DT))
            }
            else {
                dispatch(fetchRoleFailed())
            }
        }
        catch(e) {
            console.log("check error",e)
            dispatch(fetchRoleFailed())
        }
    }
}

export const fetchPositionStart = () => {
    return async (dispatch,getState) => {
        try {
            let res = await fetchPosition()
            if(res && res.EC === 0) {
                dispatch(fetchPositionSuccess(res.DT))
            }
            else {
                dispatch(fetchPositionFailed())
            }
        }
        catch(e) {
            console.log("check error",e)
            dispatch(fetchPositionFailed())
        }
    }
}

export const fetchScheduleStart = () => {
    return async (dispatch,getState) => {
        try {
            let res = await fetchTime()
            if(res && res.EC === 0) {
                dispatch(fetchScheduleSuccess(res.DT))
            }
            else {
                dispatch(fetchScheduleFailed())
            }
        }
        catch(e) {
            console.log("check error",e)
            dispatch(fetchScheduleFailed())
        }
    }
}

export const fetchDoctorRequiredStart = () => {
    return async (dispatch,getState) => {
        try {
            let resPri = await fetchPrice()
            let resPay = await fetchPayment()
            let resPro = await fetchProvince()
            let resSpe = await fetchGetSpeciality()
            let resCli = await fetchGetClinic()
            let resSta = await fetchGetStaff()
            if(
                resPri && resPri.EC === 0 &&
                resPay && resPay.EC === 0 &&
                resPro && resPro.EC === 0 &&
                resSpe && resSpe.EC === 0 &&
                resCli && resCli.EC === 0 &&
                resSta && resSta.EC === 0
                ) {  
                let data = {
                    PriRes: resPri.DT,
                    PayRes: resPay.DT,
                    ProRes: resPro.DT,
                    SpeRes: resSpe.DT,
                    CliRes: resCli.DT,
                    StaRes: resSta.DT
                }  
                dispatch(fetchDoctorRequiredSuccess(data))
            }
            else {
                dispatch(fetchDoctorRequiredFailed())
            }
        }
        catch(e) {
            console.log("check error",e)
            dispatch(fetchDoctorRequiredFailed())
        }
    }
}

// Doctor
export const fetchDoctor = () => {
    return async (dispatch,getState) => {
        try {
            let res = await fetchGetDoctor()
            if(res && res.EC === 0) {
                dispatch(getDoctorSuccess(res.DT))
            }
            else {
                dispatch(getDoctorFailed())
            }
        }
        catch(e) {
            console.log("check error",e)
            dispatch(getDoctorFailed())
        }
    }
}

export const createInfoDoctor = (data) => {
    return async (dispatch,getState) => {
        try {
            let res = await fetchCreateDoctorInfo(data)
            if(res && res.EC === 0) {
                dispatch(createInfoDoctorSuccess())
            }
            else {
                dispatch(createInfoDoctorFailed())
            }
        }
        catch(e) {
            console.log("check error",e)
            dispatch(createInfoDoctorFailed())
        }
    }
}

export const getDetailDoctor = (id) => {
    return async (dispatch,getState) => {
        try {
            let res = await fetchDetailDoctor(id)
            if(res && res.EC === 0) {
                dispatch(fetchDetailDoctorSuccess(res.DT))
            }
            else {
                dispatch(fetchDetailDoctorFailed())
            }
        }
        catch(e) {
            console.log("check error",e)
            dispatch(fetchDetailDoctorFailed())
        }
    }
}

export const createSchedule = (data) => {
    return async (dispatch,getState) => {
        try {
            let res = await fetchCreateSchedule(data)
            if(res && res.EC === 0) {
                dispatch(createScheduleSuccess())
                toast.success(res.EM)
            }
            else {
                toast.error(res.EM)
                dispatch(createScheduleFailed())
            }
        }
        catch(e) {
            console.log("check error",e)
            dispatch(createScheduleFailed())
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchScheduleSuccess = (timeData) => ({
    type: actionTypes.FETCH_SCHEDULE_SUCCESS,
    data: timeData
})

export const fetchScheduleFailed = () => ({
    type: actionTypes.FETCH_SCHEDULE_FAILED
})

export const fetchDoctorRequiredSuccess = (data) => ({
    type: actionTypes.FETCH_DOCTOR_REQUIRED_SUCCESS,
    data: data
})

export const fetchDoctorRequiredFailed = () => ({
    type: actionTypes.FETCH_DOCTOR_REQUIRED_FAILED
})

// Redux Doctor
export const getDoctorSuccess = (dataDoctor) => ({
    type: actionTypes.FETCH_DOCTOR_SUCCESS,
    data: dataDoctor
})

export const getDoctorFailed = () => ({
    type: actionTypes.FETCH_DOCTOR_FAILED
})

export const createInfoDoctorSuccess = () => ({
    type: actionTypes.CREATE_INFO_DOCTOR_SUCCESS,
})

export const createInfoDoctorFailed = () => ({
    type: actionTypes.CREATE_INFO_DOCTOR_FAILED
})

export const fetchDetailDoctorSuccess = (detail) => ({
    type: actionTypes.FETCH_DOCTOR_DETAIL_SUCCESS,
    data: detail
})

export const fetchDetailDoctorFailed = () => ({
    type: actionTypes.FETCH_DOCTOR_DETAIL_FAILED
})

export const createScheduleSuccess = () => ({
    type: actionTypes.CREATE_SCHEDULE_SUCCESS,
})

export const createScheduleFailed = () => ({
    type: actionTypes.CREATE_SCHEDULE_FAILED
})



