import React, { Component } from 'react';
import axios from 'axios'
import Article from './Article';
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
    if (event.keyCode === 13)
      this.handleSubmit(event);
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({more_articles: !this.state.more_articles})
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getAPIData('State');
  }

  tempDataFoundAndLoad(user_id,unit_no) {
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    let path = `/temp_articles?user_id=${user_id}&unit_no=${unit_no}`;
    axios
      .delete(path, {headers: headers})
      .then(res => {
        console.log('--------------->', this.state)
        console.log(res);
        // this.setState({
        //   newId: res.data.data.id,
        //   fireRedirect: true
        // });
      })
      .catch(err => console.log(err));
    axios
      .get(path, {headers: headers})
      .then(res => {
        console.log('--------------->', this.state)
        console.log(res.data);
        let articleArray = res.data.map(item => {
          let itemTemp = {
            headline: {main: item.title},
            pub_date: item.publication_date,
            web_url: item.url,
          }
          return <Article article={itemTemp} user_id={this.props.user_id} key={item.url}/>;
        })
        if (res.data.length > 0) {
          this.setState({
            articles_loaded: true,
            articles: articleArray,
            displayArticles: true,
          });
        }
        // this.setState({
        //   newId: res.data.data.id,
        //   fireRedirect: true
        // });
      })
      .catch(err => console.log(err));
  }

  callGetAPIDataProps() {
        this.getAPIData('Props');
  }

  callCheckIfDBLoaded() {
    if (this.state.articles_loaded) {
      console.log('Got data from DB');
    }
    else {
      setTimeout(this.callGetAPIDataProps.bind(this), (Number(this.props.unit_no)-1) * 1100)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.topic) {
      if (this.props.topic.query_type === 1)
        this.setState({query: this.props.topic.name});
      else if (this.props.topic.query_type === 2)
        this.setState({topic: this.props.topic.name});
      setTimeout(this.callCheckIfDBLoaded.bind(this), 2000)
    }
  }

  componentDidMount() {
    // console.log('this.props.topic = ',this.props.topic)
    // if (this.props.topic) {
    //   if (this.props.topic.query_type === 1)
    //     this.setState({query: this.props.topic.name});
    //   else
    //     this.setState({topic: this.props.topic.name});
    //   this.getAPIData();
    // }
    this.tempDataFoundAndLoad(this.props.user_id,this.props.unit_no);
  }

  postTempQueryArticle(article) {
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    axios
      .post('/temp_articles', {
        title: article.headline.main,
        publication_date: article.pub_date,
        url: article.web_url,
        user_id: this.props.user_id,
        search_unit: this.props.unit_no
      }, {headers: headers})
      .then(res => {
        // this.setState({
        //   newId: res.data.data.id,
        //   fireRedirect: true
        // });
      })
      .catch(err => console.log(err));
  }

  postTempTopArticle(article) {
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };

    axios
      .post('/temp_articles', {
        title: article.title,
        publication_date: article.published_date,
        url: article.url,
        user_id: this.props.user_id,
        search_unit: this.props.unit_no
      }, {headers: headers,})
      .then(res => {
        // this.setState({
        //   newId: res.data.data.id,
        //   fireRedirect: true
        // });
      })
      .catch(err => console.log(err));
  }

  compareQuery(a, b) {
    if (a.pub_date + a.headline.main > b.pub_date + b.headline.main) {
      return -1;
    } else if (a.pub_date + a.headline.main < b.pub_date + b.headline.main) {
      return 1;
    } else {
      return 0;
    }
  }

  compareTop(a, b) {
    if (a.published_date + a.title > b.published_date + b.title) {
      return -1;
    } else if (a.published_date + a.title < b.published_date + b.title) {
      return 1;
    } else {
      return 0;
    }
  }

  getAPIData(callType) {
    let apiKey = 'api-key=' + process.env.REACT_APP_ARTICLES_API_KEY
    let getQuery = '';
    let articleArray = [];
    if (callType === 'State') {
      if (this.state.query === '') {
        getQuery = 'https://api.nytimes.com/svc/topstories/v2/' +
          this.state.topic + '.json?' + apiKey;
          this.setState({query_topic: this.state.topic,
                         query_type: 2});
      } else {
        getQuery = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + this.state.query +
          '&' + apiKey;
          this.setState({query_topic: this.state.query,
                         query_type: 1});
      }
    } else {
      // Get query from props since state won't have been loaded yet.
      if (this.props.topic.query_type === 1) {
        getQuery = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + this.props.topic.name +
          '&' + apiKey;
          this.setState({query_topic: this.props.topic.name,
                         query_type: 1});
      }
      else if (this.props.topic.query_type === 2) {
        getQuery = 'https://api.nytimes.com/svc/topstories/v2/' +
          this.props.topic.name + '.json?' + apiKey;
          this.setState({query_topic: this.props.topic.name,
                         query_type: 2});
      }
    }
    console.log('getQuery = ', getQuery);
    // let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
//    let err_no = 429;
    // while (err_no === 429) {
      axios.get(getQuery)
        .then(res => {
          if (this.state.query === '') {
            console.log('res.data.results = ',res.data.results);
//            let tempArray = res.data.results.slice(0,10);
            let sortArray = res.data.results.slice(0,10).sort(this.compareTop);
            articleArray = sortArray.map((item,index) => {
              this.postTempTopArticle(item);
              let itemTemp = {
                headline: {main: item.title},
                pub_date: item.published_date,
                web_url: item.url,
              }
              return <Article article={itemTemp} user_id={this.props.user_id} key={item.url}/>;
            });
          } else {
            console.log('res.data.response.docs = ',res.data.response.docs);
//            let sortArray = res.data.response.docs.sort()
            let resultArray = res.data.response.docs.filter(item =>
              item.document_type === 'article' || item.document_type === 'blogpost');
            articleArray = resultArray.sort(this.compareQuery).map((item,index) => {
              this.postTempQueryArticle(item);
              return <Article article={item} user_id={this.props.user_id} key={item.web_url}/>;
            });
            this.setState({query: ''});
          }
          this.setState({
            articles_loaded: true,
            articles: articleArray,
            displayArticles: true,
          });
//          err_no = 0;
        })
        .catch(err => {
          console.log(err);
//          err_no = err;
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
      return <button type="button" className='save-articles-icon' onClick={this.saveTopic}>Save Topic</button>;
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
                className="input-query"
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
                className="input-query"
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
            <label className="input-label">
              Enter a query:
            </label>
            {this.autoFocus()}
            {this.saveButton()}
            <br />
            <label>
              Or select a NY Times Topic:
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
          <div>{this.state.articles.slice(0,this.state.more_articles ? 10 : 3)}</div>
        </div>
      </div>
      )
  }
}

export default SearchUnit;
