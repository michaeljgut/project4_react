import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import cookies from 'cookies-js';
import Nav from './Nav';


class EditTopic extends Component {
  constructor() {
    super();
    this.state = {
        newId: 0,
        name: '',
        definition: '',
        date_modified: new Date(),
        fireRedirect: false,
        user_id: cookies.get('user_id')
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.cancelTopic = this.cancelTopic.bind(this);
    this.deleteTopic = this.deleteTopic.bind(this);
  }

  componentDidMount() {
    console.log('name = ',this.props.match.params.name,)
    this.setState({name: this.props.match.params.name})
  }

  handleInputChange(e) {
    e.preventDefault();
    this.setState({
      name: e.target.value,
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    console.log('headers = ',headers)
    axios
      .put(`/topics/${this.props.match.params.topic_id}`, {
        name: this.state.name,
      }, { headers: headers })
      .then(res => {
        this.setState({
          fireRedirect: true,
        });
      })
      .catch(err => console.log(err));
    e.target.reset();
  }

  cancelTopic() {
    this.setState({
      fireRedirect: true
   });
  }

  deleteTopic() {
    let headers = {
      'access-token': cookies.get('access-token'),
      'client': cookies.get('client'),
      'token-type': cookies.get('token-type'),
      'uid': cookies.get('uid'),
      'expiry': cookies.get('expiry')
    };
    console.log('headers = ',headers);
    console.log('topic_id = ',this.props.match.params.topic_id);
    axios
      .delete(`/topics/${this.props.match.params.topic_id}`,
           { headers: headers })
      .then(res => {
        this.setState({
          fireRedirect: true,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    let path = `/topics/edit/${this.state.user_id}`
    console.log('path in topiceditform = ',path);
    return (
      <div className="edit-topic">
        <h2>Edit Topic</h2>
        <Nav user_id={this.state.user_id}/>
        <form onSubmit={this.handleFormSubmit}>
          <input className='topic-placeholder'
            type="text"
            placeholder="topic"
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
            autoFocus
          />
          <input className='edit-button' type="submit" value="SUBMIT" />
        </form>
        <button className='edit-button' onClick={this.deleteTopic}>DELETE</button>
        <button className='edit-button' onClick={this.cancelTopic}>CANCEL</button>
        {this.state.fireRedirect
          ? <Redirect push to={path} />
          : ''}
      </div>
    );
  }
}

export default EditTopic;
