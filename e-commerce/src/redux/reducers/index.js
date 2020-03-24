import {combineReducers} from 'redux'
import AuthReducers from './AuthReducers'
import HeaderReducers from './Headerreducers'

// import CartReducers from './CartReducers'

export default combineReducers({
    Auth:AuthReducers,
    Header:HeaderReducers
    // Cart:CartReducers
})