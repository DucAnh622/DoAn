import axios from '../axios';

const fetchGetDoctor = (limit) => {
    return axios.get(`/doctor/get?limit=${limit}`)
}

const fetchGetDoctorById = (doctorId) => {
    return axios.get(`/doctor/get-by-id?doctorId=${doctorId}`)
}

const fetchCreateDoctorInfo = (doctorInfo) => {
    return axios.post('/doctor-info/create',{...doctorInfo})
}

const fetchDetailDoctor = (id) => {
    return axios.get(`/doctor-detail/get?id=${id}`)
}

const fetchCreateSchedule = (data) => {
    return axios.post('/doctor-schedule/create',{...data})
}

const fetchGetSchedule = (doctorId,date) => {
    return axios.get(`/doctor-schedule/get?doctorId=${doctorId}&date=${date}`)
} 

const fetchGetDoctorInfo = (doctorId) => {
    return axios.get(`/doctor-info/get?doctorId=${doctorId}`)
}

const fetchGetPrice = (doctorId) => {
    return axios.get(`/doctor-price/get?doctorId=${doctorId}`)
}

const fetchGetAllDoctor = (limit,page) => {
    return axios.get(`/doctor/get-all?limit=${limit}&page=${page}`)
}

const fetchComment = (doctorId) => {
    return axios.get(`/doctor/get-comment?doctorId=${doctorId}`)
}

export {
    fetchGetDoctor,
    fetchGetDoctorById,
    fetchCreateDoctorInfo,
    fetchDetailDoctor,
    fetchCreateSchedule,
    fetchGetSchedule,
    fetchGetDoctorInfo,
    fetchGetPrice,
    fetchComment,
    fetchGetAllDoctor
}