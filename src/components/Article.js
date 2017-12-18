import React, { Component } from 'react';
import axios from 'axios';
import cookies from 'cookies-js';

/**
  * Article is loaded by SearchUnit and will display article information passed to it as props. A user will
  * also be able to click on a Save Article button to save the article information to the article table.
  */
class Article extends Component {

  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  };

  /**
    * handleClick will write the current article to the article table. It will then be displayed when the user
    * goes to the Saved Articles screen.
    */
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
        title: this.props.article.headline.main,
        publication_date: this.props.article.pub_date,
        url: this.props.article.web_url,
        user_id: this.props.user_id,
      }, {headers: headers})
      .catch(err => console.log(err));
  }

  render(){
    return (
      <li className="article" key={this.props.article.pub_date}>
        <a href={this.props.article.web_url}>{this.props.article.headline.main}</a>
        <span> - {this.props.article.pub_date.substr(0,10)}</span>
        <button className='button-class' onClick={this.handleClick}>Save Article</button>
      </li>
    )
  }
}


export default Article;
