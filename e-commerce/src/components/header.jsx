import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import Logo from '../support/img/Logo.png'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { countCart } from './../redux/actions'
import { URL } from '../support/Url';
import { APIURL } from '../support/ApiUrl'
import { FaShoppingCart } from 'react-icons/fa'
import Axios from 'axios'

const Header = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);


    const countCart=(id)=>{
        Axios.get(`${APIURL}/transactions?_embed=transactiondetails&userId=${id}&status=oncart`)
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
                 //console.log(res2)
                res2.forEach((val,index)=>{
                    res.data[0].transactiondetails[index].dataprod=val.data.qty
                })
                //console.log(res.data[0].transactiondetails)
                var total = 0;
                res.data[0].transactiondetails.forEach(element => {
                    total+=element.qty;
                });
                console.log(total);
                return this.setState({angka:total});
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">
                    <img src={Logo} alt="" style={{ height: '40px' }}/>
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        {props.Auth.role!=="admin"?
                            null
                            :
                        <NavItem className='mr-2 pt-2'>
                            <Link to={"/manageadmin/"}>Manage Product</Link>
                        </NavItem>
                        }
                        {props.Auth.role === 'user' ?
                            <NavItem className='mr-2 pt-2'>
                                <Link to={"/history"}> History </Link>
                            </NavItem>
                            :
                            null
                        }
                        {props.Auth.role === 'user' ?
                            <NavItem className='mr-2 pt-2'>
                                <Link to={"/cart"}> <FaShoppingCart/> </Link>
                                {props.countCart()}
                            </NavItem>
                            :
                            null
                        }
                        {props.namauser===''?
                            <NavItem className='mr-4 '>
                                <Button href="/login" variant="contained" color="primary">
                                    Login
                                </Button>
                            </NavItem>
                            :
                            null
                        }
                        {props.namauser === '' ?
                            <NavItem className='mr-2 '>
                                <Button href="/register" variant="contained" color="secondary">Register</Button>
                            </NavItem>
                            :
                            null
                        }

                        {props.AuthLog === false?
                            null
                            :
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Halo, {props.namauser}
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem >
                                        <Link to='/settings' >User Settings</Link>
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem  onClick={()=>onSignOutClick()}>
                                        <Link to='/login' onClick={()=>onSignOutClick()} >Logout</Link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        }
                        
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

const onSignOutClick=()=>{
    localStorage.clear()
    window.location.reload()
    window.location.assign(`${URL}/`)
}
const mapStateToProps=(state)=>{
    return{
        namauser:state.Auth.username,
        Cart:state.Auth.cart,
        AuthLog:state.Auth.login,
        Auth:state.Auth
    }
}

export default connect(mapStateToProps,{countCart}) (Header);