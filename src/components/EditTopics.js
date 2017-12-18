import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import cookies from 'cookies-js';
import Header from './Header';
import Image from '../images/pencil.svg'

/**
  * EditTopics is called by Router and will display all the saved topics. If the pencil icon for a topic is
  * clicked, the user will go to the EditTopic component and be able to edit that topic.
  */
class EditTopics extends Component {
  constructor() {
    super();
    this.state = {
      topics: [],
      dataLoaded: false
    }
  }

  /**
    * componentDidMount will load the data from the topics table into state where it will get displayed
    * in boxes on the screen.
    */
  componentDidMount() {
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    let path = `/topics?user_id=${cookies.get('user_id')}`;
    axios
      .get(path, { headers: headers })
      .then(res => {
        let tempArray = res.data.slice();
        this.setState({
          topics: tempArray,
          dataLoaded: true
        });
      })
      .catch(err => console.log('in error',err));
  }

  topicsMap(array){
    return array.map((topic, index) => {
      return (
        <li className="topic-list" key={topic.id} >
          {topic.name}
          <Link to={`/edit/${topic.id}/topic/${topic.name}/${topic.query_type}`}>
            <img src={Image} alt="Pencil" className="topics-pencil" />
          </Link>
        </li>
      )
    })
  }


  renderTopics(){
    if (this.state.dataLoaded){
      return (
        <div>
          {this.topicsMap(this.state.topics)}
        </div>
      )
    }
  }

  render(){
    return(
      <div className="App">
        <Header />
        <div className='edit-topics-header'>
          <h2>Saved Topics</h2>
          <div className='topic-placeholder'>
            {this.renderTopics()}
          </div>
        </div>
      </div>
    )
  }
}


export default EditTopics;
