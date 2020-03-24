import React, { Component } from 'react';
import {connect} from 'react-redux'
import Axios from 'axios'
import {APIURL} from './../support/ApiUrl'
import {Table} from 'reactstrap'
import {changetoRupiah} from './../support/changeToRp'
import {countCart} from './../redux/actions'
import {Button} from 'react-bootstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
class Cart extends Component {
    state = {
        isicart:[],
        ordercheckout:[]
    }

    componentDidMount(){
        this.getdata()
    }

    getdata=()=>{
        Axios.get(`${APIURL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}&status=oncart`)
        .then((res)=>{
            // console.log(res)
            // console.log(res.data[0].transactiondetails)
            var newarrforprod=[]
            res.data[0].transactiondetails.forEach(element => {
               newarrforprod.push(Axios.get(`${APIURL}/products/${element.productId}`)) 
            });
            // console.log(newarrforprod)
            Axios.all(newarrforprod)
            .then((res2)=>{
                // console.log(res2)
                res2.forEach((val,index)=>{
                    res.data[0].transactiondetails[index].dataprod=val.data
                })
                console.log(res.data[0].transactiondetails)
                this.setState({isicart:res.data[0].transactiondetails})
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderisidata=()=>{
        return this.state.isicart.map((val,index)=>{
            return (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{val.dataprod.name}</td>
                    <td ><img src={val.dataprod.image} height='200' alt=""/></td>
                    <td>{val.dataprod.kat}</td>
                    <td >{val.qty}</td>
                    <td><button className='btn btn-danger' onClick={()=>this.deleteconfirm(index,val.id)}>Delete</button></td>
                </tr>
            )
        })
    }

    deleteconfirm=(index,id)=>{
        MySwal.fire({
            title: `Are you sure wanna delete ${this.state.isicart[index].dataprod.name} ?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
              Axios.delete(`${APIURL}/transactiondetails/${id}`)
              .then((res)=>{
                  MySwal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  ).then((result)=>{
                      if(result.value){
                          this.getdata()
                      }
                  })
              }).catch((err)=>{
                  console.log(err)
              }) 
            }
          })
    }

    totalharga=()=>{
        let total=0
        this.state.isicart.forEach((val)=>{
            total+=val.qty*val.dataprod.harga
        })
        return(
            <tr style={{verticalAlign:"middle"}}>
                <td colSpan="2" style={{verticalAlign:"middle", fontSize:20, fontWeight:"bolder"}}>Total</td>
                <td colSpan="2" ></td>
                <td style={{fontWeight:"bolder", fontSize:20}}>{changetoRupiah(total)}</td>
            </tr>
        )}

    onClickCheckOut=()=> {
    
        if (this.state.isicart.length) {
        
          Axios.get(`${APIURL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}`)
            .then(res => {
              var aray = [];
              res.data.forEach((val, index) => {
                aray.push(
                  Axios.patch(`${APIURL}orders/${val.id}`, {
                    bayar: true
                  })
                  
                );
              });
    
              Axios.get(`${APIURL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}&bayar=true`)
              .then((res11)=>{
    
                  this.setState({ordercheckout:res11.data})
    
                  Axios.post(`${APIURL}transactionsDetails`, this.state.ordercheckout)     
                  .then(ress=>{
                      console.log(ress)
                      var idprod = this.state.idprod
                      var totalharga = this.state.totalHarga
                      var userId = this.props.User.id
                      var totalqty = this.state.isicart.length
                      var transaksi = {
                          totalharga,
                          userId,
                          totalqty
                      }
                      Axios.post(`${APIURL}transactions`, transaksi)
                      .then((su)=>{
                          console.log(su)
                      })
                  })
              })

              Axios.all(aray)
              .then(res1 => {
                console.log(res1);
                window.location.reload();
              })
              .catch(err1 => {
                console.log(err1);
              });
          })
          .catch(err => {
            console.log(err);
          });
      }
  }

    render() { 
        return (
            <div className='paddingatas'>
                <Table striped>
                    <thead>
                        <tr>
                            <th><b>No.</b></th>
                            <th><b>Nama</b></th>
                            <th><b>Gambar</b></th>
                            <th><b>Kategori</b></th>
                            <th><b>Jumlah</b></th>
                            <th><b>Hapus</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderisidata()}
                    </tbody>
                    <tfoot>
                        {this.totalharga()}
                    </tfoot>
                </Table>
                <center><Button onClick={this.onClickCheckOut} variant='dark'>Checkout</Button></center>
            </div>
          );
    }
}
const MapstatetoProps=(state)=>{
    return{
        User:state.Auth
    }
}
export default connect(MapstatetoProps) (Cart);
