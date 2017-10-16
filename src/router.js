import React from 'react';
import App from './App';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './components/Login.js'
import Register from './components/Register.js'
import SavedArticles from './components/SavedArticles.js'
import EditTopics from './components/EditTopics.js'
import EditTopic from './components/EditTopic.js'
export default (
    <BrowserRouter>
        <div className='router'>
            <Route exact path='/home' component={App} />
            <Route exact path='/' component={App} />
            <Route exact path='/articles/user/:user_id' component={SavedArticles} />
            <Route exact path='/search/user/:user_id' component={App} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/logout' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/saved_articles/:user_id' component={SavedArticles} />
            <Route exact path='/topics/edit/:user_id' component={EditTopics} />
            <Route exact path='/edit/:topic_id/topic/:name/:query_type' component={EditTopic} />
        </div>
    </BrowserRouter>
)


