import React, { Component } from 'react';
import './App.css';
import SearchUnit from './components/SearchUnit';
import Nav from './components/Nav';
import axios from 'axios';
import cookies from 'cookies-js';
import nytimes_logo from './images/poweredby_nytimes_150a.png'

class App extends Component {

  constructor() {
    super();
    this.state = {
      topics: [],
      searchUnitCount: 0,
      dataLoaded: false
    }
    this.addSearchUnit = this.addSearchUnit.bind(this);
    this.removeSearchUnit = this.removeSearchUnit.bind(this);
  }

  componentWillMount() {
   let headers = {
     'access-token': cookies.get('access-token'),
     'client': cookies.get('client'),
     'token-type': cookies.get('token-type'),
     'uid': cookies.get('uid'),
     'expiry': cookies.get('expiry')
   };
   console.log('headers = *',headers);
    let path = `/topics?user_id=${cookies.get('user_id')}`;
    console.log('path = ',path);
    axios
      .get(path,
     { headers: headers })
      .then(res => {
        console.log('--------------->', res)
        let tempArray = res.data.slice();
        console.log(tempArray[0]);
        console.log(tempArray[1]);
        this.setState({topics: tempArray,
                       dataLoaded: true});
        // this.setState({
        //   newId: res.data.data.id,
        //   fireRedirect: true
        // });
      })
      .catch(err => console.log('in error',err));
}

  addSearchUnit() {
    this.setState(prevState => ({
      searchUnitCount: prevState.searchUnitCount + 1
    }));
  }

  removeSearchUnit() {
    if (this.state.searchUnitCount > 0)
      this.setState(prevState => ({
        searchUnitCount: prevState.searchUnitCount - 1
      }));
  }

  searchUnits() {
          // <div className="buttons">
          //   <button onClick={this.addSearchUnit}>Add Another Search Unit</button>
          //   <button onClick={this.removeSearchUnit}>Remove A Search Unit</button>
          // </div>
    let returnArray = [];
    let searchi = '';
    for (let i=0; i<this.state.searchUnitCount; i++){
      searchi = 'search' + (i+3);
      console.log('searchi = ', searchi);
      returnArray[i] = (<div className={searchi}><SearchUnit user_id={this.props.match.params.user_id}/></div>);
    }
    return returnArray;
  }

  renderApp() {
    return (
        <div className="App">
          <h2>NY Times Article Search Application</h2>
          <Nav user_id={this.props.match.params.user_id}/>
          <div className="search1">
            <SearchUnit autofocus={true} user_id={this.props.match.params.user_id} unit_no="1" topic={this.state.topics[0]} />
            <SearchUnit user_id={this.props.match.params.user_id} unit_no="2" topic={this.state.topics[1]} />
          </div>
          <div className="search2">
            <SearchUnit user_id={this.props.match.params.user_id} unit_no="3" topic={this.state.topics[2]} />
            <SearchUnit user_id={this.props.match.params.user_id} unit_no="4" topic={this.state.topics[3]} />
          </div>
          {this.searchUnits()}
          <br />
        </div>
    )
  }

  render() {
    console.log('in render', this.state.topics[0]);
    // if(!this.state.dataLoaded) {
    //   return (
    //     <div>
    //       <h2>NY Times Article Search Application</h2>
    //       <Nav user_id={this.props.match.params.user_id}/>
    //       <h3>Data Is Loading...</h3>
    //     </div>
    //     );
    // } else {
      return (
        <div>
          {this.renderApp()}
        </div>
      );
    // }
  }
}

export default App;
