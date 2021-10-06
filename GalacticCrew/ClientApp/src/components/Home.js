import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

    constructor(props) {
        super(props)

        console.log("props: ")
        console.log(props);

    }
 

    welcome(username) {
        return (
            <p> Welcome {username} </p>
            )
    }

    render() {
        //let content = this.state.LoggedIn ? this.welcome(this.state.UserName) : "You are not logged in"
    return (
      <div>
            <h1>Hello battlestar crew </h1>         
        <p>Todo List:</p>
        <ul>
          <li>Create register and login page with JWT token</li>
          <li>Redirect user to pilot page</li>
          <li>Create pilot interface</li>
            </ul>
      </div>
    );
    }

}


