import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import cookies from 'cookies-js';

/**
  * Register is called by Router and will allow a user to enter a name, an email, a password and a password
  * confirmation and then enter the information into the user table.
  */
class Register extends Component {

  constructor(){
    super();
    this.state ={
        user_id: '',
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        fireRedirect: false,
        error_message: ''
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

  /**
    * handleFormSubmit will check that the entered password is at least 6 characters long and that the
    * confirmation password equals the password. Then it will enter the information into the user table.
    * it will take the header information and store it into cookies to be used whenever the user
    * interacts with the database. It then updates state so that the user can be redirected to the App
    * component. If a 422 error is returned, an error message is displayed.
    */
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
    axios('/auth', {
      method: 'POST',
      header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      data: fb
    })
    .then(res => {
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
    .catch(err => {
      console.log('Error registering is ',err);
      if (err.toString().includes('422')) {
        this.setState({
          error_message: 'Error, email is already taken, please try another'
        })
      }
    });
    e.target.reset();
  }

  render(){
    let path = '/search/user/' + this.state.user_id;
    return (
      <div className="App">
        <Header />
        <div className="auth-page">
          <h2 className="auth-header">Register to save articles!</h2>
          <div className="auth-block">
            <form onSubmit={this.handleFormSubmit}>
              <input name="name" type="text" placeholder="Name" required autoFocus onChange={this.handleInputChange}/>
              <br />
              <input name="email" type="text" placeholder="Email" required onChange={this.handleInputChange}/>
              <br />
              <input name="password" type="password" placeholder="Password" required onChange={this.handleInputChange}/>
              <br />
              <input name="passwordConfirmation" type="password" placeholder="Password Confirmation" required onChange={this.handleInputChange}/>
              <br />
              <input className='auth-submit' type="submit" value="REGISTER" />
            </form>
          </div>
          {this.state.fireRedirect
            ? <Redirect push to={path} />
            : ''}
          <p className="error_message">
            {this.state.error_message}
          </p>
        </div>
      </div>
    )
  }
}


export default Register;
