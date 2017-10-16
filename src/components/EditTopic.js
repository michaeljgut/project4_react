import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Nav from './Nav';
import cookies from 'cookies-js';


class EditTopic extends Component {
  constructor() {
    super();
    this.state = {
        newId: 0,
        name: '',
        definition: '',
        date_modified: new Date(),
        fireRedirect: false,
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
    console.log('in handleInputChange');
    console.log(e.target.value);
    const name = e.target.name;
    const value = e.target.value;
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
     console.log('headers = ',headers)
    axios
      .delete(`/topics/${this.props.match.params.topic_id}`,
           { headers: this.state.headers })
      .then(res => {
        this.setState({
          fireRedirect: true,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    let path = `/topics/edit/${cookies.get('user_id')}`
    console.log('path in topiceditform = ',path);
    return (
      <div className="edit">
        <form onSubmit={this.handleFormSubmit}>
          <input className='term-placeholder'
            type="text"
            placeholder="topic"
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
            autoFocus
          />
          <input className='submit' type="submit" value="SUBMIT" />
        </form>
        <button onClick={this.deleteTopic}>DELETE</button>
        <button onClick={this.cancelTopic}>CANCEL</button>
        {this.state.fireRedirect
          ? <Redirect push to={path} />
          : ''}
      </div>
    );
  }
}

export default EditTopic;
