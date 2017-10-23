import React from 'react';
import {
  Switch, Route,
  BrowserRouter, Link,
  Redirect, Switch
} from 'react-router-dom';
import { firebaseAuth, auth } from '../firebase';

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
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
      loading: true
    }
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


}
