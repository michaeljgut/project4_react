import React, { Component } from 'react';
import axios from 'axios';
import cookies from 'cookies-js';

/**
  * SavedArticle will display the saved article information and an unsave button which will remove the
  * article from the articles table.
  */
class SavedArticle extends Component {

  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  };

  /**
    * When the article is successfully deleted from the article table, the deleteOnClick method is called that
    * was passed in as a prop and all of the remaining saved articles are displayed.
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
      .delete(`/articles/${this.props.item.id}`,{ headers: headers })
      .then(res => {
        this.props.deleteOnClick();
      })
      .catch(err => console.log(err));
  }


  render(){
    return (
      <li className="saved-item">
        <a href={this.props.item.url}>
          {this.props.item.title}
        </a>
        - {this.props.item.publication_date}
        <button className='button-class' onClick={this.handleClick}>Unsave</button>
      </li>
    )
  }
}


export default SavedArticle;
