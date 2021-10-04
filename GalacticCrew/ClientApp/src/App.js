import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { MissionPanel } from './components/MissionPanel';
import { Register } from './components/Register';
import { Login } from './components/Login';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/MissionPanel' component={MissionPanel} />
        <Route path='/Register' component={Register} />
        <Route path='/Login' component={Login} />
      </Layout>
    );
  }
}
