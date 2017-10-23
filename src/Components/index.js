import React from 'react';
import {
  Switch, Route,
  BrowserRouter,
  Redirect,
} from 'react-router-dom';
import { auth } from '../firebase';
import Home from './Home';
import Login from './Login';

import './app.css'

function PrivateRoute ({component: Component, passedProps, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} {...passedProps} />
      : <Redirect to={{pathname: '/welcome', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, passedProps, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} {...passedProps} />
      : <Redirect to='/home' />}
    />
  )
}



export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      authed: false,
      loading: true,
      user: null
    }

    this.updateFromChild = this.updateFromChild.bind(this);
  }

  componentDidMount() {
    this.removeListener = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }

  componentWillUnmount () {
    this.removeListener()
  }

  updateFromChild(object) {
    this.setState(object)
  }

  render() {

    return this.state.loading ? <div> Loading </div> : (
      <BrowserRouter>
        <div className="App">
          <div className='App-header'>
            <div className='header-text'>
              <span> Pet Swap </span>
            </div>
            {
              this.state.authed &&
              <button
                onClick={() => auth().signOut().then(() => {
                  this.setState({user: null})
                })}
                className='header-button'>
                Log Out
              </button>
            }
            {
              !this.state.authed &&
              <button
                onClick={() => this.props.history.push('/welcome')}
                className='header-button'>
                Log In
              </button>
            }
          </div>
          <Switch>
            <Route exact path='/' render={(props) => {
                return this.state.authed ?
                <Redirect to='/welcome' /> :
                  <Redirect to='/home' />
                }} />
                <PublicRoute
                  authed={this.state.authed}
                  path='/welcome'
                  component={Login}
                  passedProps={{
                    updateFromChild: this.updateFromChild,
                  }}
                  />
                <PrivateRoute
                  authed={this.state.authed}
                  path='/home'
                  component={Home}
                  passedProps={{
                    updateFromChild: this.updateFromChild,
                    user: this.state.user
                  }}
                  />
              </Switch>
        </div>
      </BrowserRouter>
    )
  }


}
