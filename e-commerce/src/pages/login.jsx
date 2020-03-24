import React, { Component } from 'react';
import Axios from 'axios';
import { URL } from '../support/Url';
import { APIURL } from '../support/ApiUrl';
import {Link,Redirect} from 'react-router-dom';
import {connect} from 'react-redux'
import {LoginSuccessAction,Login_error} from './../redux/actions'
import { FaUserCircle, FaLock } from 'react-icons/fa';

import Loader from 'react-loader-spinner'

class Login extends Component {
    state = {
        error:'',
        loading:false
    }
    
    onLoginClick=()=>{
        var username=this.refs.username.value 
        var password=this.refs.password.value
        // this.props.Loginthunk(username,password)
        
        // this.setState({loading:true})
        Axios.get(`${APIURL}/users?username=${username}&password=${password}`)
        .then(res=>{
            if(res.data.length){
                console.log(res.data)
                localStorage.setItem('dino',res.data[0].id)
                this.props.LoginSuccessAction(res.data[0])
                window.location.reload()
                window.location.assign(`${URL}/`)
                // this.setState(login)
            }else{
                this.setState({error:'Incorrect password'})
            }
            this.setState({ loading: false })
        }).catch((err)=>{
            console.log(err)
            this.setState({loading:false})
        })
    }

    render() {
        if (this.props.AuthLog) {
            return <Redirect to={'/'}/>
        }
        return (
            <div>
                <div className="d-flex justify-content-center align-items-center" style={{height:'90vh'}}>
                    <div style={{width:'500px',border:'2px inset blue'}} className='rounded p-4'>
                        <h1>Login</h1>

                        <h3><FaUserCircle/></h3>
                        <div className='p-1' style={{border:'2px outset blue'}}>
                            <input type='text' className='username' style={{border:'transparent',width:'100%',fontsize:'20px'}} ref='username' placeholder='input username' />
                        </div>

                        <div className='mt-4'></div>

                        <h3><FaLock/></h3>
                        <div className='p-1' style={{ border: '2px outset blue' }}>
                            <input type='password' className='username' style={{ border: 'transparent', width: '100%', fontsize: '20px' }} ref='password' placeholder='input password' />
                        </div>

                        {this.state.error === ''?
                            null
                            :
                            <div className="alert alert-danger mt-2">
                                {this.state.error} <span style={{cursor:'pointer'}} onClick={()=>{this.setState({error:''})}} className='float-right font-weight-bold'>x</span>
                            </div>
                        }
                        <div className='mt-4'>
                            {this.props.Auth.loading?
                                <Loader
                                    type="Puff"
                                    color="#FF6969"
                                    height={100}
                                    width={100}
                                />
                                :
                                <button className='btn btn-primary' onClick={this.onLoginClick}>Login</button>
                            }
                        </div>
                        <div className='mt-2'>
                            belum punya akun? <Link to='/register'>Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        AuthLog:state.Auth.login,
        Auth:state.Auth
    }
}
 
export default connect(mapStateToProps, {LoginSuccessAction, Login_error}) (Login);
