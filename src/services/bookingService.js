import axios from '../axios';

const getBookingManage = (data,limit,page) => {
    return axios.get(`/booking/manage/get?id=${data.id}&date=${data.date}&&limit=${limit}&page=${page}`)
}

const confirmBookingManage = (data) => {
    return axios.post('/booking/manage/confirmSubmit',{...data})
}

const fetchHistoryBooking = (patientId,limit,page) => {
    return axios.get(`/booking/get/history?patientId=${patientId}&limit=${limit}&page=${page}`)
}

const cancelBookingManage= (data) => {
    return axios.post('/booking/manage/cancelSubmit',{...data})
}

const filterBookingManage = (type,data,limit,page) => {
    return axios.get(`/booking/manage/filter?id=${data.id}&type=${type}&date=${data.date}&limit=${limit}&page=${page}`)
}

const getTotalBookingManage = (id,date) => {
    return axios.get(`/booking/total?id=${id}&date=${date}`)
}

const fetchTotalByDay = (id,date) => {
    return axios.get(`/booking/total-by-date?id=${id}&date=${date}`)
}

const fetchScheduleByDate = (id,date) => {
    return axios.get(`/booking/schedule-by-date?id=${id}&date=${date}`)
}

export {
    getBookingManage,
    confirmBookingManage,
    cancelBookingManage,
    fetchHistoryBooking,
    filterBookingManage,
    getTotalBookingManage,
    fetchTotalByDay,
    fetchScheduleByDate
}