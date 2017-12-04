import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import cookies from 'cookies-js';
import Nav from './Nav';
import Image from '../images/pencil.svg'


class EditTopics extends Component {
    constructor() {
      super();
      this.state = {
        topics: [],
        headers: {},
        dataLoaded: false
      }
    }

componentDidMount() {
   let headers = {
     'access-token': cookies.get('access-token'),
     'client': cookies.get('client'),
     'token-type': cookies.get('token-type'),
     'uid': cookies.get('uid'),
     'expiry': cookies.get('expiry')
   };
   this.setState({headers: headers});
   console.log('headers = *',headers);
    let path = `/topics?user_id=${cookies.get('user_id')}`;
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
      })
      .catch(err => console.log('in error',err));
}

  topicsMap(array){
    return array.map((topic, index) => {
      return <div className="topic-list" ><li key={topic.id} >
          {topic.name}
          <Link to={`/edit/${topic.id}/topic/${topic.name}/${topic.query_type}`}>
            <img src={Image} alt="Pencil" className="topics-pencil" />
          </Link>
        </li></div>
    })
  }


  renderTopics(){
    if (this.state.dataLoaded){
      console.log('user_id = ',this.props.match.params.user_id);
      return (
        <div>
          {this.topicsMap(this.state.topics)}
        </div>
      )
    }
  }

  render(){
    return(
      <div className='edit-topics-header'>
          <h2>Topics</h2>
          <Nav user_id={this.props.match.params.user_id}/>
          <div className='topic-placeholder'>
            {this.renderTopics()}
          </div>
      </div>
    )
  }
}


export default EditTopics;
