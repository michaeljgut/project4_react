import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
// import Auth from 'j-toker';
//var Auth = require('j-toker');
// Auth.configure({apiUrl: 'http://localhost:3000/'});
import Auth from 'j-toker';
import cookies from 'cookies-js';

class TopArticles extends Component {

  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.button = this.button.bind(this);
  };

  button() {
    let buttonText = '';
    if (this.props.user_id) {
      buttonText = 'Save';
      return <button className='save-articles-icon' onClick={this.handleClick}>{buttonText}</button>;
    } else
    return '';
  }

  handleClick(e) {
    e.preventDefault();
   let headers = {
     'access-token': cookies.get('access-token'),
     'client': cookies.get('client'),
     'token-type': cookies.get('token-type'),
     'uid': cookies.get('uid'),
     'expiry': cookies.get('expiry')
   };

    axios
      .post('/articles', {
        title: this.props.article.title,
        publication_date: this.props.article.published_date,
        url: this.props.article.url,
        user_id: this.props.user_id,
      }, {        headers: headers,
})
      .then(res => {
        console.log('--------------->', this.state)
        console.log(res);
        // this.setState({
        //   newId: res.data.data.id,
        //   fireRedirect: true
        // });
      })
      .catch(err => console.log(err));
  }

  render(){
    return (
      <div className="search-page">
        <li className="article" key={this.props.article.published_date}>
          <a href={this.props.article.url}>{this.props.article.title}</a>
          <span> - {this.props.article.published_date.substr(0,10)}</span>
          {this.button()}
        </li>
      </div>
    )
  }
}


export default TopArticles;
