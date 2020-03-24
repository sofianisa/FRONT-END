import React, { Component } from 'react';
import {Table,Modal, ModalBody,ModalHeader,ModalFooter} from 'reactstrap'
import {Button} from 'react-bootstrap'
import Axios from 'axios';
import {APIURL} from '../support/ApiUrl'
import Pagenotfound from './pagenotfound'
import {connect} from 'react-redux'




class History extends Component {
    state = { 
        datahistory:[],
        detailhistory:[],
        modaldetail:false
     }

    componentDidMount (){
        Axios.get(`${APIURL}transactions`)
        .then((res)=>{
            this.setState({datahistory:res.data})
        })
        Axios.get(`${APIURL}transactionsDetails`)
        .then((res1)=>{
            this.setState({datadetail:res1.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderHistory=()=>{

        return this.state.datahistory.map((val,index)=>{
            return (
                <tr >
                    <td style={{width:100}}>{index+1}</td>
                    <td style={{width:100}}>{val.tanggal}</td>
                    <td style={{width:100}}>{val.dataprod.name}</td>
                    <td style={{width:500}}><img src={val.dataprod.image} height='200' alt=""/></td>
                    <td style={{width:100}}>{val.totalqty}</td>
                    <td style={{width:200}}>{val.totalharga}</td>
                </tr>
            )
        })
    }


    render() { 
        if (this.props.roleUser === "admin") {
            return <Pagenotfound />;
          }

        if(this.props.UserId){
        return ( 
            <div>


            <center style={{marginBottom:'50px'}}>
            <Table style={{width:900
            }} >
                <thead>
                    <tr>
                        <th style={{width:100}}>No.</th>
                        <th style={{width:100}}>Tanggal</th>
                        <th style={{width:100}}>Nama</th>
                        <th style={{width:500}}><center>Gambar</center></th>
                        <th style={{width:100}}>Qty</th>
                        <th style={{width:200}}>Total Harga</th>
                    </tr>
                </thead>
                <tbody>
                {this.renderHistory()}
                </tbody>
                
            </Table>
            
        </center>
            
            </div>
         );
        }
        return(
            <div>
                <Pagenotfound/>
            </div>
        )
    }
}
 
const MapstateToprops=state=>{
    return{
        AuthLog:state.Auth.login,
        UserId:state.Auth.id,
        transaksi:state.Auth.transactions,
        roleUser:state.Auth.role,
        User:state.Auth
    }
}
export default connect(MapstateToprops) (History);
