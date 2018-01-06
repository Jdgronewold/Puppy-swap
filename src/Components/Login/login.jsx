import React from 'react';
import {auth, provider} from '../../firebase';

import './login.css';

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    auth().signInWithPopup(provider).then( res => {
      this.props.updateFromChild({user: res.user})
    })
  }


  render() {

    return (
      <div className="Login">
        <div className='login-main'>
          <div className='login-main-top-text'>
            <span>
              You must login with a Gmail account.
            </span>
          </div>
          <button
            className='button'
            onClick={this.handleLogin}>
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }
}

export default Login;
