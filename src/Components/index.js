import React from 'react';
import {
  Switch, Route,
  BrowserRouter,
  Redirect
} from 'react-router-dom';
import { auth, database } from '../firebase';
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



class App extends React.Component {

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
    this.removeListener = auth().onAuthStateChanged((auth) => {
      if (auth) {
        const userRef = database.ref('users/' + auth.uid);
        userRef.once('value').then(snapshot => {
          let user;

          if (snapshot.val() === null) {

            user = {
              email: auth.email,
              name: auth.displayName,
              photo: auth.photoURL,
              groups: ['smile'],
              chatID: [],
              uid: auth.uid,
              active: true,
            }
            userRef.set(user)

          } else {

            user = snapshot.val()
            user.active = true;
            userRef.update({active: true})

          };

          this.setState({
            authed: true,
            loading: false,
            user: user
          })
        });
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
                onClick={() => {
                  const userRef = database.ref('users/' + this.state.user.uid);
                  userRef.update({active: false});
                  auth().signOut().then(() => {
                    this.setState({user: null});
                  })
                }}
                className='header-button button'>
                Log Out
              </button>
            }
            {
              !this.state.authed &&
              <div> </div>
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

export default App;
