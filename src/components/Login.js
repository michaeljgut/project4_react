import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';
import cookies from 'cookies-js';

class Login extends Component {

  constructor(props){
    super(props);
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
      console.log('path = ',path);
      return (
        <div className="auth-page">

          <h2 className="auth-header">Sign In To Search And Save Articles!</h2>
          <Nav user_id={this.props.match.params.user_id}/>
          <br/>
          <form className="auth-block" onSubmit={(e) => this.handleFormSubmit(e)}>
            <input name="email" type="text" placeholder="email" required autoFocus onChange={this.handleInputChange}/>
            <br/>
            <input name="password" type="password" placeholder="password" required onChange={this.handleInputChange}/>
            <br/>
            <input className="submit" type="submit" value="LOGIN" />
          </form>

          {this.state.fireRedirect
              ? <Redirect push to={path} />
                : ''}
          {this.state.message}
        </div>
      )
  }
}

export default Login;
