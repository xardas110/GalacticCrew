import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

    constructor(props) {
        super(props)

    }
 
    render() {
        //let content = this.state.LoggedIn ? this.welcome(this.state.UserName) : "You are not logged in"
    return (
      <div id="profileContainer">
            <h1>Battlestar Crew </h1>         
        <ul>
          <li>Currently most of the features are available on the site</li>
          <li>Not all style and design is finished.</li>
            </ul>
      </div>
    );
    }

}


