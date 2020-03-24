import {
    USER_LOGIN_FAILED,
    USER_LOGIN_START,
    USER_LOGIN_SUCCESS
} from './../actions/type'

const INITIAL_STATE={
    id:'',
    username:'',
    password:'',
    login:false,
    error: '',
    errormes:'',
    loading: false,
    cart:0,
    role:'',
    loading:false,
    islogin:false
}
export default (state=INITIAL_STATE,action)=>{
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {...state,loading:false,...action.payload,login:true,error:'',islogin:true}
        case 'COUNT_CART':
            return {...state,loading:false,cart:+action.payload}
        case 'LOGIN_LOADING':
            return {...state,loading:true,error:''}
        case 'USER_LOGIN_FAILED':
            return{...state,loading:false,errormes:action.payload}
        case 'LOGIN_ERROR':
            return {...state,error:action.payload,loading:false}
        case 'Error':
            return INITIAL_STATE
        default:
            return state
    }
}