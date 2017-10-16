import React, { Component } from 'react';
import axios from 'axios'
import TopArticles from './TopArticles';
import QueryArticles from './QueryArticles';
import cookies from 'cookies-js';

class SearchUnit extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
      topic: 'home',
      query_topic: 'home',
      query_type: 2,
      articles_loaded: false,
      articles: [],
      more_articles: false,
      query_loaded: false
    };
    // this.getAPIData = this.getAPIData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveTopic = this.saveTopic.bind(this);
  }

  handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({more_articles: !this.state.more_articles})
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getAPIData();
  }

  componentWillMount() {
    if (this.props.topic) {
      if (this.props.topic.query_type === 1)
        this.setState({query: this.props.topic.name});
      else if (this.props.topic.query_type === 2)
        this.setState({topic: this.props.topic.name});
    }
  }

  componentDidMount() {
    console.log('this.props.topic = ',this.props.topic);
    if (this.props.topic) {
      if (this.props.topic.query_type === 1)
        this.setState({query: this.props.topic.name});
      else
        this.setState({topic: this.props.topic.name});
      console.log('this.state.query = ',this.state.query);
      console.log('this.state.topic = ',this.state.topic);
      this.getAPIData();
    }
    let savedArticles = cookies.get(`saved-articles-${this.props.unit_no}`);
    console.log(`saved-articles-${this.props.unit_no}`)
    if (typeof(savedArticles) != 'undefined') {
      console.log('savedArticles = ', savedArticles);
      this.setState({articles: savedArticles})
    }
  }

  getAPIData() {
    let apiKey = 'api-key=' + process.env.REACT_APP_ARTICLES_API_KEY
    let getQuery = '';
    let articleArray = [];
    if (this.state.query === '' && this.state.query_loaded) {
      getQuery = 'http://api.nytimes.com/svc/topstories/v2/' +
        this.state.topic + '.json?' + apiKey;
        this.setState({query_topic: this.state.topic,
                       query_type: 2});
    } else {
      getQuery = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + this.state.query +
        '&' + apiKey;
        this.setState({query_topic: this.state.query,
                       query_type: 1});
    }
    console.log('getQuery = ', getQuery);
    // let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    let err_no = 429;
    // while (err_no === 429) {
      axios.get(getQuery)
        .then(res => {
          console.log('--------------->', this.state);
          console.log('res = ',res);
          console.log('this.props = ',this.props);
          if (this.state.query === '') {
            articleArray = res.data.results.map((item,index) => {
              return <TopArticles article={item} user_id={this.props.user_id}/>;
            });
          } else {
            let resultArray = res.data.response.docs.filter(item =>
              item.document_type === 'article' || item.document_type === 'blogpost');
            articleArray = resultArray.map((item,index) => {
              return <QueryArticles article={item} user_id={this.props.user_id} />;
            });
            this.setState({query: ''});
            console.log('resultArray = ',resultArray);
          }
          console.log(articleArray[0]);
          cookies.set(`saved-articles-${this.props.unit_no}`, articleArray[0].title);
          this.setState({
            articles_loaded: true,
            articles: articleArray,
            displayArticles: true,
          });
          err_no = 0;
        })
        .catch(err => {
          console.log(err);
          err_no = err;
        });
    // }
  }

  button() {
    let buttonText = '';
    if (this.state.articles_loaded) {
      if (this.state.more_articles)
        buttonText = 'Less Articles';
      else
        buttonText = 'More Articles';
      return <button className='more-articles-icon' onClick={this.handleClick}>{buttonText}</button>;
    } else
      return '';
  }

  saveButton() {
    let user_id = cookies.get(`user_id`);
    if (Number(user_id) > 0) {
      return <button className='save-articles-icon' onClick={this.saveTopic}>Save Topic</button>;
    } else
    return '';
  }

  saveTopic(e) {
    e.preventDefault();
   let headers = {
     'access-token': cookies.get('access-token'),
     'client': cookies.get('client'),
     'token-type': cookies.get('token-type'),
     'uid': cookies.get('uid'),
     'expiry': cookies.get('expiry')
   };
   console.log('in query post ',headers);
   console.log('this.query_topic = ', this.state.query_topic);
    axios
      .post('/topics', {
        name: this.state.query_topic,
        type: this.state.query_type,
        user_id: this.props.user_id,
      }, {headers: headers})
      .then(res => {
        console.log('--------------->', this.state)
        console.log(res);
      })
      .catch(err => console.log(err));
  }

  autoFocus() {
    console.log('this.state.query = ',this.state.query);
        if (this.props.topic && !this.state.query_loaded) {
          if (this.props.topic.query_type === 1)
            this.setState({query: this.props.topic.name,
                          query_loaded: true});
          else if (this.props.topic.query_type === 2)
            this.setState({topic: this.props.topic.name,
                          query_loaded: true});
          if (this.state.query_loaded)
            this.getAPIData();
        }
      if (this.props.autofocus) {
        // if (this.props.topic && !this.state.query_loaded) {
        //   if (this.props.topic.query_type === 1)
        //     this.setState({query: this.props.topic.name,
        //                   query_loaded: true});
        //   else if (this.props.topic.query_type === 2)
        //     this.setState({topic: this.props.topic.name,
        //                   query_loaded: true});
        //   if (this.state.query_loaded)
        //     this.getAPIData();
        // }

        return <input
                type="text"
                placeholder="Query"
                name="query"
                value={this.state.query}
                onChange={this.handleChange}
                autoFocus
              />
      }
      else
        return <input
                type="text"
                placeholder="Query"
                name="query"
                value={this.state.query}
                onChange={this.handleChange}
              />

  }


  render() {
    return (
      <div className="search-unit">
        <h3>Search News Stories</h3>
        <div className="get-articles">
          <form onSubmit={this.handleSubmit}>
            <label>
              Enter a query:
            </label>
            {this.autoFocus()}
            {this.saveButton()}
            <br>
            </br>
            <label>
              Or select a NY Times Topic:,
              <select name="topic" value={this.state.topic} onChange={this.handleChange}>
                <option value="home">Home</option>
                <option value="arts">Arts</option>
                <option value="automobiles">Automobiles</option>
                <option value="books">Books</option>
                <option value="business">Business</option>
                <option value="fashion">Fashion</option>
                <option value="food">Food</option>
                <option value="health">Health</option>
                <option value="insider">Insider</option>
                <option value="magazine">Magazine</option>
                <option value="movies">Movies</option>
                <option value="national">National</option>
                <option value="nyregion">New York Region</option>
                <option value="obituaries">Obituaries</option>
                <option value="opinion">Opinion</option>
                <option value="politics">Politics</option>
                <option value="realestate">Real Estate</option>
                <option value="science">Science</option>
                <option value="sports">Sports</option>
                <option value="sundayreview">Sunday Review</option>
                <option value="technology">Technology</option>
                <option value="theater">Theater</option>
                <option value="tmagazine">New York Times Magazine</option>
                <option value="travel">Travel</option>
                <option value="upshot">Upshot</option>
                <option value="world">World</option>
              </select>
            </label>
              <input className='submit' type="submit" value="SUBMIT" />
          </form>
          {this.button()}
          <p>{this.state.articles.slice(0,this.state.more_articles ? 10 : 3)}</p>
        </div>
      </div>
      )
  }
}

export default SearchUnit;
