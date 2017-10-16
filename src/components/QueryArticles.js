import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
// import Auth from 'j-toker';
//var Auth = require('j-toker');
// Auth.configure({apiUrl: 'http://localhost:3000/'});
import Auth from 'j-toker';
import cookies from 'cookies-js';

class QueryArticles extends Component {

  constructor(props){
    super(props);
    this.button = this.button.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
   console.log('in query post ',headers);
    axios
      .post('/articles', {
        title: this.props.article.headline.main,
        publication_date: this.props.article.pub_date,
        url: this.props.article.web_url,
        user_id: this.props.user_id,
      }, {headers: headers})
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
      <div className="query-page">
        <li className="article" key={this.props.article.pub_date}>
          <a href={this.props.article.web_url}>{this.props.article.headline.main}</a>
          <span> - {this.props.article.pub_date.substr(0,10)}</span>
          {this.button()}
        </li>
      </div>
    )
  }
}


export default QueryArticles;
