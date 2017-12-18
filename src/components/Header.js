import React from 'react';
import Nav from './Nav.js'

const Header = () => {
  return(
    <div className='header'>
      <h1>The New York Times' Articles Search App</h1>
      <img src={require('../images/poweredby_nytimes_150a.png')} className="nytimes_logo" alt="NY Times logo"/>
      <Nav />
    </div>
  )
}

export default Header;
