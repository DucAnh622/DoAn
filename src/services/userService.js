import axios from '../axios';

const fetchLogin = (user) => {
    return axios.post("/login",{...user})
}

const fetchRegister = (user) => {
    return axios.post("/register",{...user})
}

const fetchGetUser = (limit,page) => {
    return axios.get(`/user/get?limit=${limit}&page=${page}`)
}

const fetchCreateUser = (user) => {
    return axios.post('/user/create',{...user})
}

const fetchUpdateUser = (user) => {
    return axios.put('/user/update',{...user})
}

const fetchDeleteUser = (user) => {
    return axios.delete('/user/delete',{data: {id: user.id}})
}

const fetchSearchUser = (limit,page,keyword) => {
    return axios.get(`/user/search?page=${page}&limit=${limit}&keyword=${keyword}`)
}

const fetchFilterUser = (limit,page,type) => {
    return axios.get(`/user/filter?page=${page}&limit=${limit}&type=${type}`)
}

const fetchUserDetail = (id) => {
    return axios.get(`/user/get-detail?id=${id}`)
}

const fetchUserTotal = (id) => {
    return axios.get(`/user/total?id=${id}`)
}

const fetchGetStaff = () => {
    return axios.get('/staff/get')
}

const fetchPatient = (page,limit) => {
    return axios.get(`/patient/get?page=${page}&limit=${limit}`)
}

const fetchPatientBook = (id,limit,page) => {
    return axios.get(`/patient/book-history?patientId=${id}&page=${page}&limit=${limit}`)
}

export {
    fetchLogin,
    fetchRegister,
    fetchGetUser,
    fetchCreateUser,
    fetchUpdateUser,
    fetchDeleteUser,
    fetchSearchUser,
    fetchFilterUser,
    fetchUserDetail,
    fetchUserTotal,
    fetchGetStaff,
    fetchPatient,
    fetchPatientBook
}