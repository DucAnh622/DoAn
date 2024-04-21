export const path = {
    HOME: '/',
    INDEX: '/home',
    LOGIN: '/login',
    REGISTER: '/register',
    LOG_OUT: '/logout',
    SYSTEM: '/system',
    DOCTOR: '/doctor',
    STAFF: '/staff',
    MY_HISTORY: '/my-history/:patientId',
    MY_ACCOUNT: '/my-account/:userId',
    SEARCH: '/search',
    DOCTORS: '/doctors',
    SPECIALITIES: '/specialities',
    HOSPITALS: '/hospitals',
    DETAIL_DOCTOR: '/doctor-detail/:id',
    DETAIL_SPECIALITY: '/speciality-detail/:specialityID',
    DETAIL_CLINIC: '/clinic-detail/:clinicID',
    VERIFY_BOOKING: '/verify-booking',
};

export const Languages = {
    VI: 'vi',
    EN: 'en'
};

export const Themes = {
    Li: 'Li',
    Da: 'Da'
};

export const manageActions = {
    CREATE: 'CREATE',
    ADD: "ADD",
    EDIT: "EDIT",
    DELETE: "DELETE"
};

export const roleUsers = {
    PATIENT: 4,
    STAFF: 3,
    DOCTOR: 2,
    ADMIN: 1,
}

export const dateFormat = {
    SEND_TO_SERVER: 'DD/MM/YYYY'
};

export const YesNoObj = {
    YES: 'Y',
    NO: 'N'
}