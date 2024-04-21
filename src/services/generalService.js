import axios from '../axios';

const fetchRole = () => {
    return axios.get("/get-role");
}

const fetchPosition = () => {
    return axios.get("/get-position");
}

const fetchGender = () => {
    return axios.get("/get-gender");
}

const fetchPrice = () => {
    return axios.get("/get-price");
}

const fetchProvince = () => {
    return axios.get("/get-province");
}

const fetchPayment = () => {
    return axios.get("/get-payment");
}

const fetchTime = () => {
    return axios.get("/get-time");
}

const fetchGetTotal = () => {
    return axios.get("/get-total");
}

export {
    fetchRole,
    fetchGender,
    fetchPosition,
    fetchPrice,
    fetchProvince,
    fetchPayment,
    fetchTime,
    fetchGetTotal    
}