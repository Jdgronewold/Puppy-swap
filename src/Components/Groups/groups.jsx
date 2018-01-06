import React from 'react';
import { database } from '../../firebase';

import './groups.css'

class Groups extends React.Component {

  state = {
    show: true,
    loading: true,
  }

  componentDidMount() {
    this.userRef = database.ref('users/' + this.props.user.uid);
    let groupData = [];
    const {groups} = this.props.user;

    database.ref('groups').once("value").then(
      snapshot => {
        if (groups) {
          this.props.user.groups.forEach( group => {
            groupData.push(snapshot[group])
          })
          this.setState({groups: groupData, loading: false});
        } else {
          this.setState({groups: [], loading: false})
        }
      }
    )

  }


  render() {


    return (
      <div
        className={`Groups ${this.state.show ? 'groups-open' : 'groups-closed'}`}
        >
        <div className='groups-header'>
          <div className='groups-header-text'>
            <span>Your Groups</span>
          </div>
          <div className='groups-header-chevron'>
            <span> > </span>
          </div>
        </div>
        <div className='groups-body'>

        </div>
      </div>
    )
  }
}

export default Groups;
