import React, { Component } from 'react';
import axios from 'axios';
import Nav from './Nav';
import cookies from 'cookies-js';
import DeleteArticle from './DeleteArticle';

class SavedArticles extends Component {

  constructor(props){
    super(props);
    this.state ={
      query: '',
      articles: []
    };
    this.deleteOnClick = this.deleteOnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  }

  handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
    if (event.keyCode === 13)
      this.handleSubmit(event);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  listArticles() {
    if (this.state.query === '' && this.state.query === '*') {
      return this.state.articles.map(item => {
        return <DeleteArticle item={item} deleteOnClick={this.deleteOnClick} key={item.url}/>
      })
    } else {
      return this.state.articles.filter( article => {
        return article.title.match(this.state.query) ? article : ''
      }).map(item => {
        return <DeleteArticle item={item} deleteOnClick={this.deleteOnClick} key={item.url}/>
      })
    }
  }

  render(){
    return (
      <div className="save-page">
        <h2 className="save-header">Saved Articles</h2>
        <Nav user_id={this.props.match.params.user_id}/>
        <br />
        <form onSubmit={this.handleSubmit}>
          <label className="input-label">
            Search Article Titles:
          </label>
          <input
                className="input-query"
                type="text"
                placeholder="Query"
                name="query"
                value={this.state.query}
                onChange={this.handleChange}
                autoFocus
          />
          <input className='submit' type="submit" value="SUBMIT" />
        </form>
        {this.listArticles()}
      </div>
    )
  }
}


export default SavedArticles;
