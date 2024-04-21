import axios from '../axios';

const fetchBook = (dataBook) => {
    return axios.post('/patient/booking',{...dataBook})
}

const fetchVerify = (verify) => {
    return axios.post('/verify-booking',{...verify})
}

const fetchSearch = (data) => {
    return axios.get(`/patient/search?keyword=${data.keyword}&type=${data.type}&sort=${data.sort}`)
}

const fetchCancel = (data) => {
    return axios.post('/patient/cancel-booking',{...data})
}

const fetchRateBooking = (data) => {
    return axios.post('/patient/rate-booking',{...data})
}

export {
    fetchBook,
    fetchVerify,
    fetchSearch,
    fetchCancel,
    fetchRateBooking
}