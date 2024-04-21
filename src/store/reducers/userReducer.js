import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    token: null
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.userInfo,
                token: action.userInfo.token
            }
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
                token: null
            }
        case actionTypes.ACCOUNT_UPDATE_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.newUserInfo
            }
        case actionTypes.ACCOUNT_UPDATE_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null
            }  
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
                token: null
            }
        default:
            return state;
    }
}

export default userReducer;