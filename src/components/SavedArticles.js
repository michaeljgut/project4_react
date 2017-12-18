import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import cookies from 'cookies-js';
import SavedArticle from './SavedArticle';

/**
  * SavedArticles is called by Router and displays the Saved Articles screen, which lists all articles in the
  * articles table for the current user. The user is also allowed to select only articles that match an
  * input search string by title and publication date.
  */
class SavedArticles extends Component {

  constructor(){
    super();
    this.state ={
      query: '',
      articles: []
    };
    this.deleteOnClick = this.deleteOnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
    * componentDidMount will get articles for the current user and load them into state
    */
  componentDidMount() {
   let headers = {
     'access-token': cookies.get('access-token'),
     'client': cookies.get('client'),
     'token-type': cookies.get('token-type'),
     'uid': cookies.get('uid'),
     'expiry': cookies.get('expiry')
   };
    let path = `/articles?user_id=${this.props.match.params.user_id}`;
    axios
      .get(path,
     { headers: headers })
      .then(res => {
        let tempArray = res.data.slice();
        this.setState({
          articles: tempArray
        });
      })
      .catch(err => console.log('in error',err));
  }

  handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
    if (event.keyCode === 13)
      this.handleSubmit(event);
  }

  deleteOnClick() {
    this.componentDidMount();
  }

  listArticles() {
    /**
      * If nothing is typed into the search query or a '*', then show all articles, otherwise, filter based on
      * what the user enters. The SavedArticle component will display the saved article information and take
      * the deleteOnClick method as a prop. This is then called after an article is removed from the article
      * table and redisplays the remaining articles.
      */
    if (this.state.query === '' || this.state.query === '*') {
      return this.state.articles.map(item => {
        return <SavedArticle item={item} deleteOnClick={this.deleteOnClick} key={item.url}/>
      })
    } else {
      return this.state.articles.filter( article => {
        return (article.title.toUpperCase().includes(this.state.query.toUpperCase()) ||
                article.publication_date.toString().includes(this.state.query)) ? article : ''
      }).map(item => {
        return <SavedArticle item={item} deleteOnClick={this.deleteOnClick} key={item.url}/>
      })
    }
  }

  render(){
    return (
      <div className="App">
        <Header />
        <div className="save-page">
          <h2>Saved Articles</h2>
          <form >
            <label className="input-label">
              Search Saved Articles By Title/Publication Date:
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
          </form>
          {this.listArticles()}
        </div>
      </div>
    )
  }
}


export default SavedArticles;
