import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Auth from 'j-toker';
import Nav from './Nav';
import cookies from 'cookies-js';
import DeleteArticle from './DeleteArticle';

class SavedArticles extends Component {

  constructor(props){
    super(props);
    this.state ={
      refreshPage: 'Hello',
      articles: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.deleteOnClick = this.deleteOnClick.bind(this);
  }

  componentDidMount() {
   let headers = {
     'access-token': cookies.get('access-token'),
     'client': cookies.get('client'),
     'token-type': cookies.get('token-type'),
     'uid': cookies.get('uid'),
     'expiry': cookies.get('expiry')
   };
   console.log('headers = ',headers)
    let path = `/articles?user_id=${this.props.match.params.user_id}`;
    axios
      .get(path,
     { headers: headers })
      .then(res => {
        console.log('--------------->', this.state)
        let tempArray = res.data.slice();
        console.log(tempArray[0]);
        this.setState({articles: tempArray});
      })
      .catch(err => console.log('in error',err));
  }

  button() {
      let buttonText = 'Unsave';
      return <button className='unsave-articles-icon' onClick={this.handleClick}>{buttonText}</button>;
  }

  deleteOnClick() {
    console.log('in deleteOnClick');
    this.componentDidMount();
    this.setState({refreshPage: 'Goodbye'});
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
      .delete(`/articles?id=`, {
        title: this.props.article.headline.main,
        publication_date: this.props.article.pub_date,
        url: this.props.article.web_url,
        user_id: this.props.user_id,
      })
      .then(res => {
        console.log('--------------->', this.state)
        console.log(res);
      })
      .catch(err => console.log(err));
  }

  listArticles() {
    return this.state.articles.map(item => {
      return <DeleteArticle item={item} deleteOnClick={this.deleteOnClick} />
    })
  }

  render(){
    return (
      <div className="auth-page">
        <h2 className="auth-header">Saved Articles</h2>
        <Nav user_id={this.props.match.params.user_id}/>
        <br />
        {this.listArticles()}
      </div>
    )
  }
}


export default SavedArticles;
