import axios from '../axios';
const fetchCreateClinic = (data) => {
    return axios.post('/clinic/create',{...data})
} 

const fetchGetClinic = (limit) => {
    return axios.get(`/clinic/get?limit=${limit}`)
}

const fetchGetDetailClinic = (clinicID) => {
    return axios.get(`/clinic/get-detail?clinicID=${clinicID}`)
}

const fetchGetClinicByAddress = (keyword,limit,page) => {
    return axios.get(`/clinic/get-clinic-by-Address?keyword=${keyword}&limit=${limit}&page=${page}`)
}

const fetchDeleteClinic = (clinic) => {
    return axios.delete('/clinic/delete',{data: { clinicId: clinic.clinicId }})
}

const fetchGetAllClinic = (limit,page) => {
    return axios.get(`/clinic/get-all?limit=${limit}&page=${page}`)
}

export {
    fetchCreateClinic,
    fetchDeleteClinic,
    fetchGetClinic,
    fetchGetDetailClinic,
    fetchGetClinicByAddress,
    fetchGetAllClinic
}