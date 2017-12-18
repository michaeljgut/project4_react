import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import cookies from 'cookies-js';

/**
  * Login is called by Router and will accept and email and password and will attempt to login. If success,
  * then header information is stored in cookies for future interaction with the database and the user is
  * redirected to the App screen.
  */
class Login extends Component {

  constructor(){
    super();
    this.state ={
        user_id: '',
        email: '',
        password: '',
        message: '',
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
    axios('/auth/sign_in', {
      method: 'POST',
      data: {
        email: this.state.email,
        password: this.state.password,
      },
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
        fireRedirect: true,
      });
    })
    .catch(err => {
      console.log('in error',err);
      this.setState({
        message: 'Invalid email or password, please try again.'
      });
    });
    e.target.reset();
  }


  render(){
    let path = '/search/user/' + this.state.user_id;
    return (
      <div className="App">
        <Header />
        <div className="auth-page">
          <h2 className="auth-header">Sign In To Search And Save Articles!</h2>
          <form className="auth-block" onSubmit={this.handleFormSubmit}>
            <input
              name="email"
              type="text"
              placeholder="email"
              required autoFocus
              onChange={this.handleInputChange}
            />
            <br/>
            <input
              name="password"
              type="password"
              placeholder="password"
              required
              onChange={this.handleInputChange}
            />
            <br/>
            <input className="auth-submit" type="submit" value="LOGIN" />
          </form>

          {this.state.fireRedirect
              ? <Redirect push to={path} />
                : ''}
          <p className="error-message">
            {this.state.message}
          </p>
        </div>
      </div>
    )
  }
}

export default Login;
