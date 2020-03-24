const INTIAL_STATE={
    loading:false,
    cart:0
}

export default (state=INTIAL_STATE, action) => {
    switch (action.type) {
        // case "CART_START" :
        //     return{...state, loading:true}
        case "COUNT_CART" :
            return{...state, loading:false,cart:+action.payload}
        default :
            return state
    }
}