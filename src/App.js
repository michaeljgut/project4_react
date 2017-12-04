import React, { Component } from 'react';
import './App.css';
import SearchUnit from './components/SearchUnit';
import Nav from './components/Nav';
import axios from 'axios';
import cookies from 'cookies-js';

class App extends Component {

  constructor() {
    super();
    this.state = {
      topics: [],
      dataLoaded: false
    }
  }

  componentWillMount() {
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    let path = `/topics?user_id=${cookies.get('user_id')}`;
    console.log('topics path = ',path);
    axios
      .get(path,
     { headers: headers })
      .then(res => {
        let tempArray = res.data.slice();
        console.log('topics array = ', tempArray);
        this.setState({topics: tempArray,
                       dataLoaded: true});
      })
      .catch(err => console.log('in error',err));
}

  searchUnits() {
    let returnArray = [];
    returnArray[0] = (<SearchUnit autofocus={true} user_id={this.props.match.params.user_id} unit_no="1"
      key="0" />);
    for (let i=1; i<= this.state.topics.length; i++){
      returnArray[i] = (<SearchUnit user_id={this.props.match.params.user_id} unit_no={i+1} key={i}
        topic={this.state.topics[i-1]} />);
    }
    return returnArray;
  }

  render() {
    if(!this.state.dataLoaded) {
      return (
        <div className="App">
          <h1>The New York Times' Articles Search App</h1>
          <img src={require('./images/poweredby_nytimes_150a.png')} className="nytimes_logo" alt="NY Times logo"/>
          <Nav user_id={this.props.match.params.user_id}/>
          <h2>Data Is Loading...</h2>
        </div>
        );
    } else {
      return (
        <div className="App">
          <h1>The New York Times' Articles Search App</h1>
          <img src={require('./images/poweredby_nytimes_150a.png')} className="nytimes_logo" alt="NY Times logo"/>
          <Nav user_id={this.props.match.params.user_id}/>
          <div className="search">
            {this.searchUnits()}
          </div>
          <br />
        </div>
      );
    }
  }
}

export default App;
