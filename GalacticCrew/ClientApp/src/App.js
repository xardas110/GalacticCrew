import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { MissionPanel } from './components/MissionPanel';
import { Register } from './components/Register';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { Container } from 'reactstrap';
import './custom.css'
import { NavMenu } from './components/NavMenu';
import { MissionStatus } from './components/MissionStatus';
import { BrowserRouter } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Market } from './components/Market';
import { MyShips } from './components/MyShips';



const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');

export default class App extends Component {
  static displayName = App.name;

    constructor(props) {
        super(props)

        this.state =
        {
            loggedIn: false,
            user: {}
        }

        this.FetchUserData = this.FetchUserData.bind(this);
        this.UpdateUserState = this.UpdateUserState.bind(this);
        this.UpdatePlayerCurrency = this.UpdatePlayerCurrency.bind(this);
        console.log("App logger: ");
        console.log(this.props);

    }

    UpdateUserState(userState) {
        this.setState({ user: userState });
    }

    UpdatePlayerCurrency(newCurrency) {
       
        var updatedData = this.state.user;
        updatedData.currency = newCurrency;
        this.setState({ user: updatedData });
    }

    componentDidMount() {
        this.FetchUserData();
    }

    async FetchUserData() {

        const response = await fetch('Api/OnLogin',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            });

        console.log(response.status);

        if (response.status == 200) {
            const data = await response.json();
            console.log("App fetch data");
            console.log(data);
            data.loggedIn = true;

            this.setState({
                user: data
            });
        }
    }

    render() {
        console.log("rerender app");
        return (<div class="bg-image">                           
            <BrowserRouter basename={baseUrl}>
                <NavMenu setUser={this.UpdateUserState} user={this.state.user}/> 
                <Container className="mainContainer">
                    <Route exact path='/' component={Home} />
                    <Route path='/Register' component={() => <Register />} />
                    <Route path='/Login' component={() => <Login setUser={this.UpdateUserState} loggedIn={this.state.user.loggedIn} />} />
                    <Route path='/Profile' component={() => <Profile />} />
                    <Route path='/Missionpanel' component={() => <MissionPanel />} />
                    <Route path='/MissionStatus' component={() => <MissionStatus />} />
                    <Route path='/Market' component={() => <Market />} />
                    <Route path='/MyShips' component={() => <MyShips setPlayerCurrency={this.UpdatePlayerCurrency} playerCurrency={this.state.user.currency} />} />
                </Container>
                </BrowserRouter>     
            </div>
        );     
    }
}
