import React, { Component } from 'react';
import axios from 'axios'
import Article from './Article';
/**
  * cookies are used to save header information after a user successfully logs in. These are then used when
  * interacting with the back end for authentication.
  */
import cookies from 'cookies-js';

/**
  * Search Unit is loaded by App and will display article data either stored in the temp_articles table
  * or retrieved from a NY Times API.
  */
class SearchUnit extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
      topic: 'home',
      current_topic: 'home',
      /**
        * query_type of 1 is for user entered queries, query_type of 2 is for topics taken from the New York
        * Times' sections
        */
      query_type: 2,
      /**
        * articles_loaded is set to true when articles have been loaded into the articles array either from
        * the temp articles table or from an API call to the NY Times.
        */
      articles_loaded: false,
      articles: [],
      // more_articles determines whether to display 3 or up to 10 articles on the screen
      more_articles: false,
      // error_message is used when the API call fails
      error_message: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveTopic = this.saveTopic.bind(this);
  }

  /**
    * componentDidMount will first check for any recent temporary topics and articles to save making an API call.
    * Then it will update current topic in state with the topic in props for display purposes. Then it will
    * start a process after 3 seconds which will check if there were any temp articles and if not it will get
    * them from the NY Times API.
    */

  componentDidMount() {
    this.getTempData(this.props.user_id,this.props.unit_no);
    if (this.props.topic) {
      // Load the topic into state
      if (this.props.topic.query_type === 1)
        this.setState({
          query: this.props.topic.name,
          current_topic: this.props.topic.name
        });
      else if (this.props.topic.query_type === 2) {
        this.setState({
          topic: this.props.topic.name,
          current_topic: this.props.topic.name
        });
      }
      // After 3 seconds, see if any articles were loaded by getTempData. If not, get them from the API.
      setTimeout(this.callCheckIfDBLoaded.bind(this), 3000)
    }
  }

  /**
    * handleChange will display the characters typed in to the query field. If the enter key is pressed
    * handleSubmit is called.
    */
  handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value
    });
    // If enter key is pressed
    if (event.keyCode === 13)
      this.handleSubmit(event);
  }

  /**
    * handleClick will toggle more_articles between true or false, which determines how many articles are
    * displayed.
    */
  handleClick(event) {
    event.preventDefault();
    this.setState({
      more_articles: !this.state.more_articles
    })
  }

  /**
    * handleSubmit will call getAPIData with a parameter of 'State' which will call the NY Times API with
    * the user chosen query
    */
  handleSubmit(event) {
    event.preventDefault();
    this.getAPIData('State');
  }

  /**
    * getTempData will first delete any temporary topics or articles that are greater than 12 hours old and
    * then get the remaining topics and articles and display them.
    */
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

        // Only get any remaining temp topics in the topics table after the deletion has completed.
        axios
          .get(pathTopic, {headers: headers})
          .then(resTopic => {
            if (resTopic.data.length > 0) {
              let tempTopic = resTopic.data[0];
              this.setState({
                current_topic: tempTopic.name,
                query_type: tempTopic.query_type
              });
            }
          })
          .catch(err => console.log('in error',err));
      })
      .catch(err => console.log(err));
    let path = `/temp_articles?user_id=${user_id}&unit_no=${unit_no}`;
    axios
      .delete(path, {headers: headers})
      .then(res => {

        // Only get any remaining articles in the temp article table after the deletion has completed.
        axios
          .get(path, {headers: headers})
          .then(res => {
            let articleArray = res.data.map(item => {
              let itemTemp = {
                headline: {main: item.title},
                pub_date: item.publication_date,
                web_url: item.url,
              }
              return <Article article={itemTemp} user_id={user_id} key={item.url}/>;
            })
            if (res.data.length > 0) {
              this.setState({
                articles_loaded: true,
                articles: articleArray,
              });
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  /**
    * callCheckIfDBLoaded will check if the articles were already loaded from the database. If not, the
    * articles are loaded from the NY Times API using the topic from props. A delay is calculated based on
    * the unit number because there is a limit of 1 call per second to the NY Times article API and 5 calls
    * per second for the NY Times Top Stories API.
    */
  callCheckIfDBLoaded() {
    if (this.state.articles_loaded) {
      console.log('Got data from DB');
    }
    else {
      setTimeout(this.callGetAPIDataProps.bind(this), (Number(this.props.unit_no)-1) * 1100);
    }
  }

  /**
    * callGetAPIDataProps will call getAPIData with a parameter of 'Props' which will make the API call
    * using the topic from props. This is necessary to be able to have getAPIData run on a delayed basis in
    * the setTimeout function.
    */
  callGetAPIDataProps() {
        this.getAPIData('Props');
  }

  /**
    * postTempArticle will post the title, publication date and URL of an article to the temp_articles table
    * for the user and unit number passed in as props.
    */
  postTempArticle(title, publication_date, url) {
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    axios
      .post('/temp_articles', {
        title: title,
        publication_date: publication_date,
        url: url,
        user_id: this.props.user_id,
        search_unit: this.props.unit_no
      }, {headers: headers})
      .catch(err => console.log(err));
  }

  /**
    * compareQuery will compare the 2 articles in the format from the NY Times Articles API by publication
    * date and title in order to sort them current articles first.
    */
  compareQuery(a, b) {
    if (a.pub_date + a.headline.main > b.pub_date + b.headline.main) {
      return -1;
    } else if (a.pub_date + a.headline.main < b.pub_date + b.headline.main) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
    * compareTop will compare the 2 articles in the format from the NY Times Top Articles API by publication
    * date and title in order to sort them current articles first.
    */
  compareTop(a, b) {
    if (a.published_date + a.title > b.published_date + b.title) {
      return -1;
    } else if (a.published_date + a.title < b.published_date + b.title) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
    * getAPIData will make a call to a NY Times API to get URLs for articles based on a topic. The articles
    * are then loaded into state and displayed on the screen. The parameter callType determines where the
    * topic is taken from, either from state or from props.
    */
  getAPIData(callType) {
    let apiKey = 'api-key=' + process.env.REACT_APP_ARTICLES_API_KEY
    let getQuery = '';
    let articleArray = [];
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    if (callType === 'State') {
      let queryName = '';
      /**
        * If this.state.query equals the null string then this query was chosen from the topics list,
        * and is stored in this.state.topic. Otherwise, it was typed in by the user and is stored in
        * this.state.query. The topics list uses the top stories API, the query uses the article search API.
        */
      if (this.state.query === '') {
        queryName = this.state.topic;
        getQuery = 'https://api.nytimes.com/svc/topstories/v2/' +
          this.state.topic + '.json?' + apiKey;
          this.setState({current_topic: this.state.topic,
                         query_type: 2});
      } else {
        queryName = this.state.query;
        getQuery = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + this.state.query +
          '&sort=newest&' + apiKey;
          this.setState({current_topic: this.state.query,
                         query_type: 1});
      }
      axios
        .post('/topics', {
          name: queryName,
          query_type: this.state.query_type,
          user_id: this.props.user_id,
          search_unit: this.props.unit_no
        }, {headers: headers})
        .catch(err => console.log('Error retrieving from API is ',err));
      // Delete temp articles from last query, if there were any articles
      let path = `/temp_articles/temp?user_id=${this.props.user_id}&unit_no=${this.props.unit_no}`;
      axios
        .delete(path, {headers: headers})
        .catch(err => console.log('Error deleting temp articles is ',err));
    } else {
      // Get query from props.
      if (this.props.topic.query_type === 1) {
        getQuery = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + this.props.topic.name +
          '&sort=newest&' + apiKey;
          this.setState({
            current_topic: this.props.topic.name,
            query_type: 1
          });
      }
      else if (this.props.topic.query_type === 2) {
        getQuery = 'https://api.nytimes.com/svc/topstories/v2/' +
          this.props.topic.name + '.json?' + apiKey;
          this.setState({
            current_topic: this.props.topic.name,
            query_type: 2
          });
      }
    }
    /**
      * Now make the call to the appropriate API. The article data is formatted differently for each API.
      * Sort the data, write the data to the temp_articles database, then store it into state in a format
      * so that it can be displayed on the screen.
      */
    axios.get(getQuery)
      .then(res => {
        if (this.state.query === '') {
          let sortArray = res.data.results.slice(0,10).sort(this.compareTop);
          articleArray = sortArray.map((item,index) => {
            this.postTempArticle(item.title, item.published_date, item.url);
            let itemTemp = {
              headline: {main: item.title},
              pub_date: item.published_date,
              web_url: item.url,
            }
            return <Article article={itemTemp} user_id={this.props.user_id} key={item.url}/>;
          });
        } else {
          let resultArray = res.data.response.docs.filter(item =>
            item.document_type === 'article' || item.document_type === 'blogpost');
          articleArray = resultArray.sort(this.compareQuery).map((item,index) => {
            this.postTempArticle(item.headline.main, item.pub_date, item.web_url);
            return <Article article={item} user_id={this.props.user_id} key={item.web_url}/>;
          });
          this.setState({query: ''});
        }
        this.setState({
          articles_loaded: true,
          articles: articleArray,
        });
      })
      .catch(err => {
        console.log('Error from NY Times API is ',err, ' on query ',getQuery);
        this.setState({error_message: 'Could not process query, please contact support or enter another'});
      });
  }

  /**
    * button will display a button that will toggle either more or less articles stored in state. If no
    * articles have been loaded yet, the empty string is returned.
    */
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

  /**
    * saveButton will display the Save Topic button next to the current topic to allow the user to save
    * the current topic.
    */
  saveButton() {
    if (!this.props.topic) {
      return <button type="button" className='button-class' onClick={this.saveTopic}>Save Topic</button>;
    } else
    return '';
  }

  /**
    * saveTopic will write the current topic to the topics table with a search unit of 0. It will then
    * appear in the topics screen and will display as a saved topic.
    */
  saveTopic(e) {
    e.preventDefault();
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    axios
      .post('/topics', {
        name: this.state.current_topic,
        query_type: this.state.query_type,
        user_id: this.props.user_id,

        // Search unit 0 means this is not a temporary topic
        search_unit: 0
      }, {headers: headers})
      .then(res => {
      })
      .catch(err => console.log(err));
  }

  /**
    * capitalize takes a string parameter and capitalizes it. The parameter is given a default value of
    * 'home'.
    */
  capitalize(string='home') {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
    * topicName will return Current or Saved Topic depending on whether a topic was passed as a prop. If no
    * topic was passed, then the topic was not a saved topic.
    */
  topicName() {
    if (!this.props.topic)
      return 'Current Topic: ';
    else
      return 'Saved Topic: ';
  }

  render() {
    let content = '';
    /**
      * If no topic was passed as a prop, then let the user enter a topic by either typing in a query or
      * selecting a topic from a list.
      */
    if (!this.props.topic) {
      content = (
        <div>
          <h2 className="search-header">Search Articles</h2>
          <form onSubmit={this.handleSubmit}>
            <label className="input-label">
              Type in a topic:
            </label>
            <input
              className="input-query"
              type="text"
              placeholder="Topic"
              name="query"
              value={this.state.query}
              onChange={this.handleChange}
              autoFocus
            />
            <br/>
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
        </div>
      )
    }

    return (
      <div className="search-unit">
        {content}
        <p className="current-topic">{this.topicName()}{this.capitalize(this.state.current_topic)}{this.saveButton()}</p>
        {this.button()}
        <div>{this.state.articles.slice(0,this.state.more_articles ? 10 : 3)}</div>
        <div className='error-message'>{this.state.error_message}</div>
      </div>
      )
  }
}

export default SearchUnit;
