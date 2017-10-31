import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';
import cookies from 'cookies-js';

class Register extends Component {

  constructor(props){
    super(props);
    this.state ={
        user_id: '',
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        fireRedirect: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleFormSubmit(e){
    e.preventDefault();
    if (this.state.password.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
    if (this.state.password !== this.state.passwordConfirmation) {
      alert('Password does not equal confirmation!');
      return;
    }


     let fb = {
              "email": this.state.email,
              "password": this.state.password,
              "confirm_success_url": 'www.google.com'
    }
    console.log('fb = ',fb);
    axios('/auth', {
      method: 'POST',
      header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      data: fb
    })
    .then(res => {
      console.log(res)
      console.log('res.headers = ',res.headers);
       //setting cookies here
       cookies.set('access-token', res.headers["access-token"]);
       cookies.set('client', res.headers["client"]);
       cookies.set('token-type', res.headers["token-type"]);
       cookies.set('uid', res.headers["uid"]);
       cookies.set('expiry', res.headers["expiry"]);
       cookies.set('user_id', res.data.data.id);
      this.setState({
        user_id: res.data.data.id,
        fireRedirect: true
      })
    })
    .catch(err => console.log(err));
    e.target.reset();
  }

  render(){
    let path = '/search/user/' + this.state.user_id;
    return (
      <div className="auth-page">
        <h2 className="reg-header">Register to save articles!</h2>
        <Nav user_id={this.props.match.params.user_id}/>
        <br />
        <div className="auth-block">
          <form onSubmit={(e) => this.handleFormSubmit(e)}>
            <input name="name" type="text" placeholder="Name" required autoFocus onChange={this.handleInputChange}/>
            <br />
            <input name="email" type="text" placeholder="Email" required onChange={this.handleInputChange}/>
            <br />
            <input name="password" type="password" placeholder="Password" required onChange={this.handleInputChange}/>
            <br />
            <input name="passwordConfirmation" type="password" placeholder="Password Confirmation" required onChange={this.handleInputChange}/>
            <br />
            <input className='submit' type="submit" value="SIGN UP" />
          </form>
        </div>
        {this.state.fireRedirect
          ? <Redirect push to={path} />
          : ''}
      </div>
    )
  }
}


export default Register;
