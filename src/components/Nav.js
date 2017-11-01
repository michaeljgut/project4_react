import React from 'react';
import cookies from 'cookies-js';
import axios from 'axios';

class Nav extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = {logout: false};
  }

  handleClick() {
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    console.log('headers = ',headers)
    let path = `/auth/sign_out`;

    // Set user_id to 0
    cookies.set('user_id', 0);
    axios
      .delete(path,
         { headers: headers })
      .then(res => {
        console.log('--------------->', res)
        this.render();
        this.setState({
          logout: true
        });
      })
      .catch(err => console.log('in error',err));

  }

  render() {

    let path = '';
    if (Number(this.props.user_id) > 0 && !this.state.logout) {
      path = '/search/user/' + this.props.user_id;
    }
    else {
      path = '/';
    }
    let savedPath = '/saved_articles/' + this.props.user_id;
    let editPath = '/topics/edit/' + this.props.user_id;

    let content = '';
    if (Number(this.props.user_id) > 0 && !this.state.logout)
      content = (
        <div className='nav-line'>
          <a href = {path} className='nav-link2'>Home</a>
          <a href = "/" onClick={this.handleClick} className='logout'>Logout</a>
          <a href = '/register' className='nav-link2'>Register</a>
          <a href = {savedPath} className='nav-link2'>Saved Articles</a>
          <a href = {editPath} className='nav-link2'>Edit Topics</a>
        </div>
      )
    else
      content = (
        <div className='nav-line'>
          <a href = '/login' className='nav-link2'>Login</a>
          <a href = '/register' className='nav-link2'>Register</a>
        </div>
      )
    return content;
  }
}

export default Nav;
