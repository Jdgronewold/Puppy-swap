import React from 'react';
import {
  Switch, Route,
  BrowserRouter,
  Redirect,
} from 'react-router-dom';
import { auth } from '../firebase';
import Home from './Home';
import Login from './Login';

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
      : <Redirect to={{pathname: '/welcome', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/dashboard' />}
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
      </BrowserRouter>
    )
  }


}
