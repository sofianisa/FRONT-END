import Axios from 'axios'
import {APIURL} from '../../support/ApiUrl'

export const countCart=()=>{
    return (dispatch)=>{
        // dispatch ({type:"CART_START"})
        Axios.get(`${APIURL}/transactions?_embed=transactiondetails&userId=2&status=oncart`)
        .then((res)=>{
            // console.log(this.props.User.id)
            // axios.get hasilnya objek, axios.all hasilnya array
            var newarrforprod=[]
            res.data[0].transactiondetails.forEach(element =>{
                newarrforprod.push(Axios.get(`${APIURL}/products/${element.productId}`))
            })
            console.log(newarrforprod)
            Axios.all(newarrforprod)
            .then((res2)=>{
                console.log(res2)
                res2.forEach((val, index)=>{
                    res.data[0].transactiondetails[index].dataprod=val.data //buat masukin data ke objeknya
                })
                // console.log(res.data[0].transactiondetails)
                // this.setState({isicart:res.data[0].transactiondetails})
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