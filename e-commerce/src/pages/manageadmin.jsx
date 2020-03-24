import React, { Component } from 'react';
import { Table,Modal,ModalBody,ModalFooter,ModalHeader,Button } from 'reactstrap';
import Axios from 'axios';
import { APIURL } from '../support/ApiUrl';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
const MySwal = withReactContent(Swal)

class ManageAdmin extends Component {
    state = {
        products:[],
        isModaladdOpen:false,
        isModaleditopen:false,
        indexedit:0,
        indexdelete:-1,
        categories:[]
    }

    componentDidMount(){
        Axios.get(`${APIURL}/products?_expand=kategori`)
        .then((res)=>{
            Axios.get(`${APIURL}/kategoris`)
            .then((kategoris)=>{
                this.setState({products:res.data,categories:kategoris.data})
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    toogleadd=()=>{
        this.setState({isModaladdOpen:!this.state.isModaladdOpen})
    }

    toggleedit=()=>{
        this.setState({isModaleditopen:!this.state.isModaleditopen})
    }

    onSaveaddDataClick=()=>{
        var namaadd=this.refs.namaadd.value
        var imageadd=this.refs.imageadd.value
        var stokeadd=parseInt(this.refs.stokeadd.value)
        var categoryadd=parseInt(this.refs.categoryadd.value)
        var hargaadd=parseInt(this.refs.hargaadd.value)
        var deskripsiadd=this.refs.deskripsiadd.value
        var obj={
            name:namaadd,
            image:imageadd,
            stok:stokeadd,
            kategoriId:categoryadd,
            harga:hargaadd,
            deskripsi:deskripsiadd
        }
        Axios.post(`${APIURL}/products`,obj)
        .then((res)=>{
            console.log(res.data)
            Axios.get(`${APIURL}/products?_expand=kategori`)
            .then((resakhir)=>{
                this.setState({products:resakhir.data,isModaladdOpen:false})
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    deleteconfirm=(index,id)=>{
        MySwal.fire({
            title: `Are you sure wanna delete ${this.state.products[index].name} ?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
              Axios.delete(`${APIURL}/products/${id}`)
              .then((res)=>{
                  MySwal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  ).then((result)=>{
                      if(result.value){
                          Axios.get(`${APIURL}/products?_expand=kategori`)
                          .then((res1)=>{
                            this.setState({products:res1.data})
                          })
                      }
                  })
              }).catch((err)=>{
                  console.log(err)
              }) 
            }
          })
    }
    onsaveEditClick=()=>{
        var namaedit=this.refs.namaedit.value
        var imageedit=this.refs.imageedit.value
        var stokeedit=parseInt(this.refs.stokeedit.value)
        var categoryedit=parseInt(this.refs.categoryedit.value)
        var hargaedit=parseInt(this.refs.hargaedit.value)
        var deskripsiedit=this.refs.deskripsiedit.value
        var obj={
            name:namaedit,
            image:imageedit,
            stok:stokeedit,
            kategoriId:categoryedit,
            harga:hargaedit,
            deskripsi:deskripsiedit
        }
        var id=this.state.products[this.state.indexedit].id
        console.log(obj,id)
        Axios.put(`${APIURL}/products/${id}`,obj)
        .then((res)=>{
            // console.log(res.data)
            Axios.get(`${APIURL}/products?_expand=kategori`)
            .then((resakhir)=>{
                this.setState({products:resakhir.data,isModaleditopen:false})
            }).catch((err)=>{
                console.log(err)
            })
        })

    }
    onEditClick=(index)=>{
        this.setState({indexedit:index,isModaleditopen:true})
    }
    renderProducts=()=>{
        const {products} =this.state 
        return products.map((val,index)=>{
            return (
                <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{val.name}</td>
                    <td><img src={val.image} alt={val.name} width='150' height='200px'/></td>
                    <td>{val.stok}</td>
                    <td>{val.kategori.nama}</td>
                    <td>{val.harga}</td>
                    <td>{val.deskripsi}</td>
                    <td>
                        <button className='mr-3 btn btn-primary' onClick={()=>this.onEditClick(index)} >Edit</button>
                        <button className='btn btn-danger' onClick={()=>this.deleteconfirm(index,val.id)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    rendercategprytoadd=()=>{
        return this.state.categories.map((val,index)=>{
            return <option key={index} value={val.id}>{val.nama}</option>
        })
    }
    
    render() {
        const {indexedit,products}=this.state 
        if(this.props.User.role==='admin'){
            return ( 
                <div className='pt-5'>
                    <Modal isOpen={this.state.isModaladdOpen} toggle={this.toogleadd}>
                        <ModalHeader toggle={this.toogleadd}>Add data</ModalHeader>
                        <ModalBody>
                            <input type="text" ref='namaadd' placeholder='Product name' className='form-control mt-2 '/>
                            <input type="text" ref='imageadd' placeholder='Url Image' className='form-control mt-2'/>
                            <input type="number" ref='stokeadd' placeholder='jumlah stok' className='form-control mt-2'/>
                            <select ref='categoryadd' className='form-control mt-2'>
                                <option value="" hidden>Pilih category</option>
                                {this.rendercategprytoadd()}
                            </select>
                            <input type="number" ref='hargaadd' placeholder='Harga ' className='form-control mt-2'/>
                            <textarea cols="20" rows="5" ref='deskripsiadd' className='form-control mt-2' placeholder='deskripsi' ></textarea>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onSaveaddDataClick}>Save</Button>
                            <Button color="secondary" onClick={this.toogleadd}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    {
                    this.state.products.length?
                    <Modal isOpen={this.state.isModaleditopen} toggle={this.toggleedit}>
                        <ModalHeader toggle={this.toggleedit}>edit data {products[indexedit].name}</ModalHeader>
                        <ModalBody>
                            <input type="text" ref='namaedit' defaultValue={products[indexedit].name} placeholder='Product name' className='form-control mt-2 '/>
                            <input type="text" ref='imageedit' defaultValue={products[indexedit].image} placeholder='Url Image' className='form-control mt-2'/>
                            <input type="number" ref='stokeedit' defaultValue={products[indexedit].stok} placeholder='jumlah stok' className='form-control mt-2'/>
                            <select ref='categoryedit' defaultValue={products[indexedit].kategoriId} className='form-control mt-2'>
                                <option value="" hidden>Pilih category</option>
                                {this.rendercategprytoadd()}
                            </select>
                            <input type="number" defaultValue={products[indexedit].harga} ref='hargaedit' placeholder='Harga ' className='form-control mt-2'/>
                            <textarea cols="20" rows="5" defaultValue={products[indexedit].deskripsi} ref='deskripsiedit' className='form-control mt-2' placeholder='deskripsi' ></textarea>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onsaveEditClick}>Save</Button>
                            <Button color="secondary" onClick={this.toggleedit}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    :
                    null
                    }
                    
                    <Table striped>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>image</th>
                                <th>stok</th>
                                <th>Category</th>
                                <th>Harga</th>
                                <th>Deskripsi</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.renderProducts()}
                        </tbody>
                    </Table>
                    <center><button className='btn btn-primary' onClick={this.toogleadd}>Add data</button></center>
                </div>
             );
        }else{
            return <Redirect to='/notfound'/>
        }
    }
}
const MapstatetoProps=(state)=>{
    return{
        User:state.Auth
    }
}
export default connect(MapstatetoProps)(ManageAdmin);