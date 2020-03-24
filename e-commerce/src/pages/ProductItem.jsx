import React, { Component } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

const onAddCart=(ID,JUMLAH)=>{
    return{
        type:"ADD_CART",
        payload:{
            id:ID,
            jumlah:JUMLAH
        }
    }
}


class ProductItem extends Component{

    state={
        selectedId:"",
        selectedJumlah:0,
    }

    onAddClick=(id)=>{
        let jumlahInput=parseInt(this.jumlah.value) 
            if (this.jumlah.value==""){
                jumlahInput=1
            }
        this.setState({selectedJumlah:jumlahInput})
        axios.get(
            `http://localhost:2000/products`,
            {
                param:{
                    id:id
                }
            }
           
        ).then((res)=>{
            this.setState({selectedId:res.data[id-1].id})
            var jenis=this.state.selectedId
            var jumlah=this.state.selectedJumlah
            var newCart={
                jenis,jumlah
            }
            
            var oldCart=JSON.parse(localStorage.getItem('userCart')) || []
            oldCart.push(newCart)
            localStorage.setItem('userCart', JSON.stringify(oldCart))
            

            
            
        }).catch((err)=>{

        })
    }

    
    render(){
        let {id, name, harga, image, kat} = this.props.barang
        
        return(
            <div className="card col-4 mb-2 shadow-sm p-4">
                
                <Link to={`/productdetail/${id}`}>
                    <div className="text-center" style={{height:"200px"}}>
                        <img className="" src={image} style={{width:"200px"}}/>
                    </div>
                    <div className="card-body">
                        <center><h5 className="card-title text-dark" style={{height:"60px"}} >{name}</h5></center>
                        <center><h5 className="card-title text-primary" style={{height:"10px"}} >{kat}</h5></center>
                    </div>
                </Link >
                    <div className="text-right">    
                        <center><h5 className="card-text text-right text-success d-inline" style={{height:"20px"}} >Rp. {harga}</h5></center>
                    </div>
                    
            </div>
           
        )
            
    }
}

export default connect(null,{onAddCart})(ProductItem)