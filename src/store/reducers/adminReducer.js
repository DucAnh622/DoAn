import actionTypes from '../actions/actionTypes';

const initialState = {
    gender: [],
    role: [],
    position: [],
    Date: [],
    user: [],
    totalPage: 0,
    doctors: [],
    detailDoctor: '',
    infoDoctor: ''
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            let copyState = {...state}
            copyState.gender = action.data
            return {
                ...copyState
            }
        case actionTypes.FETCH_GENDER_FAILED:
            console.log("Check failed",action)
            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.role = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_FAILED:
            console.log("Check failed",action)
            return {
                ...state
            }     
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.position = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_POSITION_FAILED:
            console.log("Check failed",action)
            return {
                ...state
            }
        case actionTypes.FETCH_SCHEDULE_SUCCESS:
            state.Date = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_SCHEDULE_FAILED:
            console.log("Check failed",action)
            return {
                ...state
            } 
        case actionTypes.FETCH_DOCTOR_REQUIRED_SUCCESS:
                state.infoDoctor = action.data
                return {
                    ...state
                }
        case actionTypes.FETCH_DOCTOR_REQUIRED_FAILED:
                console.log("Check failed",action)
                return {
                    ...state
                }      
        case actionTypes.FETCH_DOCTOR_SUCCESS:
            state.doctors = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_DOCTOR_FAILED:
            console.log("Check failed",action)
            return {
                ...state
            } 
        case actionTypes.CREATE_INFO_DOCTOR_SUCCESS:
            return {
                ...state
            }
        case actionTypes.CREATE_INFO_DOCTOR_FAILED:    
            return {
                ...state
            }
        case actionTypes.CREATE_SCHEDULE_SUCCESS:
            return {
                ...state
            }
        case actionTypes.CREATE_SCHEDULE_FAILED:    
            return {
                ...state
            }    
        case actionTypes.FETCH_DOCTOR_DETAIL_SUCCESS:
            state.detailDoctor = action.data
            return {
                ...state
            }    
        case actionTypes.FETCH_DOCTOR_DETAIL_FAILED:
            console.log("Check failed",action)
            return {
                ...state
            }                                                 
        default:
            return state;
    }
}

export default adminReducer;