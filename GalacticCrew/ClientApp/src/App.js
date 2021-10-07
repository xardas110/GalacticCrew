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
import { NavMenu }  from './components/NavMenu';
import { BrowserRouter } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";


const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');

export default class App extends Component {
  static displayName = App.name;

    constructor(props) {
        super(props)

        this.state =
        {
            LoggedIn: false,
            UserName: null,
            UserId: null,
        }

        this.FetchUserData = this.FetchUserData.bind(this);

        console.log("App logger: ");
        console.log(this.props);

    }
    componentDidMount() {
        console.log("component mount");
        this.FetchUserData();
    }
    
    render() {
      //<Navbar data={{ loggedIn: this.state.LoggedIn }} />
        return (
                <BrowserRouter basename={baseUrl}>
                    <NavMenu data={{ navMenu: this.state.navMenu, loggedIn: (bLogIn) => { this.setState({ loggedIn: bLogIn }) } }} /> 
                <Container>                                                                        
                    <Route exact path='/' component={() => <Home data={{ userName: this.state.UserName, loggedIn: this.state.LoggedIn }} />} />
                    <Route path='/MissionPanel' component={MissionPanel} />
                    <Route path='/Register' component={Register} />
                    <Route path='/Login' component={() => <Login data={{ navMenu: this.state.navMenu, loggedIn: (bLogIn) => { this.setState({ loggedIn: bLogIn }) } }} />} />
                    <Route path='/Profile' component={Profile} />
                    </Container>
                </BrowserRouter>
            
        );
        
    }

    async FetchUserData() {
       
        const response = await fetch('Api/User',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            });

        if (response.status == 200) {
            const data = await response.json();
            this.setState({
                LoggedIn: true,
                UserName: data.userName
            });
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("userName", data.userName);
        }
        else {
            this.setState({
                LoggedIn: false
            });
            console.log("app else statement running inside fetch");
            localStorage.setItem("loggedIn", false);
            localStorage.setItem("userName", null);
        }
    }

}
