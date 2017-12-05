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
      query_loaded: false,
      error_message: ''
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

  getTempData(user_id,unit_no) {
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    let pathTopic = `/topics/save?user_id=${user_id}&unit_no=${unit_no}`;
    axios
      .delete(pathTopic, {headers: headers})
      .then(res => {
        console.log('--------------->', this.state)
        console.log(res);

        // Only get any remaining temp topics in the topics table after the deletion has completed.
        axios
          .get(pathTopic,
         { headers: headers })
          .then(resTopic => {
            console.log('resTopic.data in temp topics = ',resTopic.data);
            if (resTopic.data.length > 0) {
              let tempTopic = resTopic.data[0];
              this.setState({query_topic: tempTopic.name,
                             query_type: tempTopic.query_type});
            }
          })
          .catch(err => console.log('in error',err));
      })
      .catch(err => console.log(err));
    let path = `/temp_articles?user_id=${user_id}&unit_no=${unit_no}`;
    axios
      .delete(path, {headers: headers})
      .then(res => {
        console.log('--------------->', this.state)
        console.log(res);

        // Only get any remaining articles in the temp article table after the deletion has completed.
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
          })
          .catch(err => console.log(err));
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
      if (this.props.topic.query_type === 1){
        setTimeout(this.callGetAPIDataProps.bind(this), (Number(this.props.unit_no)-1) * 1100)
      } else {
        this.callGetAPIDataProps();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('this.props.topic = ',this.props.topic);
    if (this.props.topic) {
      if (this.props.topic.query_type === 1)
        this.setState({query: this.props.topic.name,
                       query_topic: this.props.topic.name});
      else if (this.props.topic.query_type === 2) {
        console.log('this.props.topic.name = ',this.props.topic.name);
        this.setState({topic: this.props.topic.name,
                       query_topic: this.props.topic.name});
      }
      setTimeout(this.callCheckIfDBLoaded.bind(this), 3000)
    }
  }

  componentDidMount() {
    console.log('this.props.topic = ',this.props.topic);
    // if (this.props.topic) {
    //   if (this.props.topic.query_type === 1)
    //     this.setState({query: this.props.topic.name});
    //   else
    //     this.setState({topic: this.props.topic.name});
    //   this.getAPIData();
    // }
    this.getTempData(this.props.user_id,this.props.unit_no);
    this.componentWillReceiveProps();
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
    console.log('callType = ',callType);
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    if (callType === 'State') {
      // Delete temp articles from last query, if there were any
      let queryName = '';
      if (this.state.query === '') {
        queryName = this.state.topic;
        getQuery = 'https://api.nytimes.com/svc/topstories/v2/' +
          this.state.topic + '.json?' + apiKey;
          this.setState({query_topic: this.state.topic,
                         query_type: 2});
      } else {
        queryName = this.state.query;
        getQuery = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + this.state.query +
          '&' + apiKey;
          this.setState({query_topic: this.state.query,
                         query_type: 1});
      }
      axios
        .post('/topics', {
          name: queryName,
          query_type: this.state.query_type,
          user_id: this.props.user_id,
          search_unit: this.props.unit_no
        }, {headers: headers})
        .then(res => {
          console.log('res = ',res);
        })
        .catch(err => console.log('in error ',err));
      let path = `/temp_articles/temp?user_id=${this.props.user_id}&unit_no=${this.props.unit_no}`;
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
    // console.log('getQuery = ', getQuery);
    axios.get(getQuery)
      .then(res => {
        console.log('this.state.query = ',this.state.query);
        if (this.state.query === '') {
          console.log('res.data.results = ',res.data.results);
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
      })
      .catch(err => {
        console.log(err);
        this.setState({error_message: 'Could not process query, please contact support or enter another'});
      });
  }

  button() {
    let buttonText = '';
    if (this.state.articles_loaded) {
      if (this.state.more_articles)
        buttonText = 'Less Articles';
      else
        buttonText = 'More Articles';
      return <button className='button-class' onClick={this.handleClick}>{buttonText}</button>;
    } else
      return '';
  }

  saveButton() {
    let user_id = cookies.get(`user_id`);
    if (Number(user_id) > 0) {
      return <button type="button" className='button-class' onClick={this.saveTopic}>Save Topic</button>;
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
    console.log('this.state.query_topic = ', this.state.query_topic);
    axios
      .post('/topics', {
        name: this.state.query_topic,
        query_type: this.state.query_type,
        user_id: this.props.user_id,

        // Search unit 0 means this is not a temporary topic
        search_unit: 0
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
                placeholder="Topic"
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
                placeholder="Topic"
                name="query"
                value={this.state.query}
                onChange={this.handleChange}
              />

  }

  capitalize(string='home') {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    return (
      <div className="search-unit">
        <h2>Search Articles</h2>
        <div className="get-articles">
          <form className="search-form" onSubmit={this.handleSubmit}>
            <label className="input-label">
              Type in a topic:
            </label>
            {this.autoFocus()}
            <br />
            <label className="input-select">
              Or select a topic:
              <select className="input-select" name="topic" value={this.state.topic} onChange={this.handleChange}>
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
            <input className='submit-button-class' type="submit" value="SUBMIT" />
          </form>
          <p className="current-topic">Current topic: {this.capitalize(this.state.query_topic)}{this.saveButton()}</p>
          {this.button()}
          <div>{this.state.articles.slice(0,this.state.more_articles ? 10 : 3)}</div>
          <div className='error-message'>{this.state.error_message}</div>
        </div>
      </div>
      )
  }
}

export default SearchUnit;
