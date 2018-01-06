import React from 'react';
import Groups from '../Groups';
import './home.css';

class Home extends React.Component {

  componentDidMount() {
    // this.groupListener = database.ref('')
  }


  render() {

    return (
      <div className='Home'>
        <Groups user={this.props.user}/>
        <div className="Calendar">

        </div>
      </div>
    )
  }
}

export default Home;
