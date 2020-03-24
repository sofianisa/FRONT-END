import Axios from 'axios'
import { USER_LOGIN_START, USER_LOGIN_FAILED, USER_LOGIN_SUCCESS, USER_SEARCH_ITEM } from './type'
import { APIURL } from '../../support/ApiUrl'


export const LoginUser=({username,password})=>{
    return (dispatch)=>{
        dispatch({type:USER_LOGIN_START})
        if(username===''||password===''){//kalo ada input yang kosong
            dispatch({type:USER_LOGIN_FAILED,payload:'username atau password tidak terisi'})
        }else{
            Axios.get(`${APIURL}/users`,{
                params:{
                    username:username,
                    password:password
                }
            })
            .then((res)=>{
                if(res.data.length){//user ada
                    localStorage.setItem('iduser',res.data[0].id)
                    dispatch({type:USER_LOGIN_SUCCESS,payload:res.data[0]})
                }else{
                    dispatch({type: USER_LOGIN_FAILED,payload:'username atau password tidak terdaftar'})
                }
            }).catch((err)=>{
                console.log(err)
                dispatch({type:USER_LOGIN_FAILED,payload:err.message})
            })
        }
    }
}

export const errormessageclear=()=>{
    return{
        type:'ErrorClear'
    }
}
export const KeepLogin=(data)=>{
    return{
        type:USER_LOGIN_SUCCESS,
        payload:data
    }
}


export const LoginSuccessAction=(datauser)=>{
    return{
        type:'LOGIN_SUCCESS',
        payload:datauser
    }
}


export const Login_error=()=>{
    return(dispatch)=>{
        dispatch({type:'LOGIN_ERROR',payload:'Login_error'})
    }
}

export const countCart=(id)=>{
    return (dispatch)=>{
        Axios.get(`${APIURL}/transactions?_embed=transactiondetails&userId=${id}&status=oncart`)
        .then((res)=>{   
            var newarrforprod=[]
            res.data[0].transactiondetails.forEach(element =>{
                newarrforprod.push(Axios.get(`${APIURL}/products/${element.productId}`))
            })
            console.log(newarrforprod)
            Axios.all(newarrforprod)
            .then((res2)=>{
                console.log(res2)
                res2.forEach((val, index)=>{
                    res.data[0].transactiondetails[index].dataprod=val.data 
                })
                let total=0
                res.data[0].transactiondetails.forEach((val)=>{
                    total+=val.qty
                })
                dispatch({type:"COUNT_CART",payload: total})
            })
        }).catch((err)=>{
            console.log(err)
        })
    }
  }

export const GantiPassword = (passwordbaru) => {
    return {
      type: "GANTI_PASSWORD",
      payload: passwordbaru
    };
};

export const CartAction=(e)=>{
    return {
      type: 'ADD_CART',
      payload: e
    }
  }
  
  export const searchItem=({searchInput})=>{
    return (dispatch)=>{
        dispatch({type:USER_SEARCH_ITEM,payload:searchInput})
        if(localStorage.getItem('search')===''){
        localStorage.setItem('search','empty')
        }else{
        localStorage.setItem('search',searchInput)
        }
    }
  }