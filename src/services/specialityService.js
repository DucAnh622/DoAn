import axios from '../axios';

const fetchCreateSpeciality = (data) => {
    return axios.post('/speciality/create',{...data})
} 

const fetchGetSpeciality = (limit) => {
    return axios.get(`/speciality/get?limit=${limit}`)
}

const fetchGetDetailSpeciality = (specialityID) => {
    return axios.get(`/speciality/get-detail?specialityID=${specialityID}`)
}

const fetchGetAllSpeciality = (limit,page) => {
    return axios.get(`/speciality/get-all?limit=${limit}&page=${page}`)
}

const fetchGetDoctorByProvince = (provinceID,specialityID) => {
    return axios.get(`/speciality/get-doctor-by-Province?provinceID=${provinceID}&specialityID=${specialityID}`)
}

const fetchDeleteSpeciality = (speciality) => {
    return axios.delete('/speciality/delete',{data: {specialityId: speciality.specialityId}})
}

export {
    fetchCreateSpeciality,
    fetchDeleteSpeciality,
    fetchGetSpeciality,
    fetchGetDetailSpeciality,
    fetchGetDoctorByProvince,
    fetchGetAllSpeciality
}