import React from 'react';
import cookies from 'cookies-js';
import axios from 'axios';

class Nav extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  // handleClick will logout the current user and then display the login and register navigation options.
  handleClick() {
    // headers are needed for devise_token_auth and are set at login time.
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    let path = `/auth/sign_out`;

    // Set user_id to 0 when logging out.
    cookies.set('user_id', 0);
    axios
      .delete(path,
         { headers: headers })
      .then(() => {
        this.render();
      })
      .catch(err => console.log('Error: ',err,' logging out.'));
  }

  render() {
    let content = '';
    let user_id = cookies.get('user_id');
    if (Number(user_id) > 0) {
      let savedPath = '/saved_articles/' + user_id;
      let editPath = '/topics/edit/' + user_id;
      let path = '/search/user/' + user_id;
      content = (
        <div className='nav-line'>
          <a href = {path} className='nav-link2'>Home</a>
          <a href = "/" onClick={this.handleClick} className='logout'>Logout</a>
          <a href = {savedPath} className='nav-link2'>Saved Articles</a>
          <a href = {editPath} className='nav-link3'>Saved Topics</a>
        </div>
      )
    }
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
