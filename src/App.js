import React, { Component } from 'react';
import './App.css';
import SearchUnit from './components/SearchUnit';
import Header from './components/Header';
import axios from 'axios';
import cookies from 'cookies-js';

/**
  * App is the first component rendered after a user logs in. It is also rendered when a user navigates to it
  * by clicking on the Home link.
  */
class App extends Component {

  constructor() {
    super();
    this.state = {
      topics: [],
      dataLoaded: false
    }
  }

  // Get all of the topics for current user and store them in state.
  componentWillMount() {
    // headers are needed for devise_token_auth and are set at login time.
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    let path = `/topics?user_id=${cookies.get('user_id')}`;
    axios
      .get(path,
       { headers: headers })
      .then(res => {
        this.setState({topics: res.data.slice(),
                       dataLoaded: true});
      })
      .catch(err => console.log('Error: ',err,' while reading from topics table.'));
  }

  /**
   * Create a search unit for each topic for the user. Leave the first search unit blank and put the cursor
   * there.
   */
  searchUnits() {
    if(this.state.dataLoaded) {
      let returnArray = [];
      returnArray[0] = (<SearchUnit user_id={this.props.match.params.user_id} unit_no="1" key="0" />);
      for (let i=1; i<= this.state.topics.length; i++){
        returnArray[i] = (<SearchUnit user_id={this.props.match.params.user_id} unit_no={i+1} key={i}
          topic={this.state.topics[i-1]} />);
      }
      return returnArray;
    } else
      return (
          <h2>Data Is Loading...</h2>
        );
  }

  render() {
      return (
        <div className="App">
          <Header />
          {this.searchUnits()}
        </div>
      );
  }
}

export default App;
