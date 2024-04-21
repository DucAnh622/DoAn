const actionTypes = Object.freeze({
    //app
    APP_START_UP_COMPLETE: 'APP_START_UP_COMPLETE',
    SET_CONTENT_OF_CONFIRM_MODAL: 'SET_CONTENT_OF_CONFIRM_MODAL',
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
    CHANGE_THEME: "CHANGE_THEME",
    
    //admin
    // ADMIN_LOGIN_SUCCESS: 'ADMIN_LOGIN_SUCCESS',
    // ADMIN_LOGIN_FAIL: 'ADMIN_LOGIN_FAIL',
    PROCESS_LOGOUT: 'PROCESS_LOGOUT',

    //user
    ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',
    USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
    USER_LOGIN_FAIL: 'USER_LOGIN_FAIL',
    ACCOUNT_UPDATE_SUCCESS: 'ACCOUNT_UPDATE_SUCCESS',
    ACCOUNT_UPDATE_FAIL: 'ACCOUNT_UPDATE_FAIL',
    
    // admin
    FETCH_GENDER_START: 'FETCH_GENDER_START',
    FETCH_GENDER_SUCCESS: 'FETCH_GENDER_SUCCESS',
    FETCH_GENDER_FAILED: 'FETCH_GENDER_FAILED',

    FETCH_ROLE_SUCCESS: 'FETCH_ROLE_SUCCESS',
    FETCH_ROLE_FAILED: 'FETCH_ROLE_FAILED',
    
    FETCH_POSITION_SUCCESS: 'FETCH_POSITION_SUCCESS',
    FETCH_POSITION_FAILED: 'FETCH_POSITION_FAILED',

    FETCH_SCHEDULE_SUCCESS: 'FETCH_SCHEDULE_SUCCESS',
    FETCH_SCHEDULE_FAILED: 'FETCH_SCHEDULE_FAILED',

    FETCH_DOCTOR_REQUIRED_SUCCESS: 'FETCH_DOCTOR_REQUIRED_SUCCESS',
    FETCH_DOCTOR_REQUIRED_FAILED: 'FETCH_DOCTOR_REQUIRED_FAILED',

    // Doctor
    FETCH_DOCTOR_SUCCESS: 'FETCH_DOCTOR_SUCCESS',
    FETCH_DOCTOR_FAILED: 'FETCH_DOCTOR_FAILED',

    FETCH_DOCTOR_DETAIL_SUCCESS: 'FETCH_DOCTOR_DETAIL_SUCCESS',
    FETCH_DOCTOR_DETAIL_FAILED: 'FETCH_DOCTOR_DETAIL_FAILED',

    CREATE_INFO_DOCTOR_SUCCESS:'CREATE_INFO_DOCTOR_SUCCESS',
    CREATE_INFO_DOCTOR_FAILED:'CREATE_INFO_DOCTOR_FAILED',

    CREATE_SCHEDULE_SUCCESS:'CREATE_SCHEDULE_SUCCESS',
    CREATE_SCHEDULE_FAILED:'CREATE_SCHEDULE_FAILED',
})

export default actionTypes;