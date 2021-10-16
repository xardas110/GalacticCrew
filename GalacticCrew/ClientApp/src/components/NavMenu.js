import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';

import 'react-circular-progressbar/dist/styles.css';
import './NavMenu.css';
import { CircularProgressbar } from 'react-circular-progressbar';


export class NavMenu extends Component {
  static displayName = NavMenu.name;

    constructor(props)
    {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.OnLogout = this.OnLogout.bind(this);

        this.state = {
            user: {},
            collapsed: true
        };

        console.log("navmenu logger:");
        console.log(props);
    }



    componentDidMount() {
        console.log("componentDidMount navbar");
        //this.FetchUserData();
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
            console.log(data);
            data.loggedIn = true;
            this.setState({
                user: data
            });
        }
    }

  
    UpdateNavMenu() {
        console.log("Update nav menu called");
    }
        

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps navbar from parameter");
        console.log(nextProps);
        console.log("componentWillReceiveProps navbar");
        console.log(this.props);

        if (this.props != nextProps || this.state.user != nextProps.user)
            this.setState({ user: nextProps.user });
    }

    componentWillUnmount() {
        console.log("componentWillUnmount NAVBAR");
    }

    componentWillUpdate() {
        console.log("componentWillUpdate navbar");
    }

    componentDidUpdate() {
        console.log("componentDidUpdate navbar");
    }

    toggleNavbar () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    async OnLogout(e) {
        const response = await fetch('Api/Logout',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        if (response.status === 200) {
            this.setState({ user: { loggedIn: false } });
            this.props.setUser(this.state.user);
        }
      
    }

    render() {

        console.log("navbar render running");
        console.log(this.state.user);

        let content = this.state.user.loggedIn? this.GetNewSideBarLoggedIn(this.state.user) : this.GetNewSideBarLoggedOut();

        return content;       
    }


    GetNewSideBarLoggedOut() {
        return (<header className="mainheader">
            <Navbar className="sidebar">
                <Container>
                    <NavbarBrand tag={Link} to="/">GalacticCrew</NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className="text-white" to="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-white" to="/Login">Login</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-white" to="/Register">Register</NavLink>
                        </NavItem>
                    </ul>
                </Container>
            </Navbar>
            <Navbar className="sidebar1">
                <Container>
                    <ul className="navbar-nav flex-grow">
                        <NavbarBrand tag={Link} to="/">Not logged in</NavbarBrand>
                    </ul>
                </Container>
            </Navbar>
        </header>)
    }

    GetNewSideBarLoggedIn(user) {

        console.log("GetNewSideBarLoggedIn");
        console.log(user);
        

        return (<header className="mainheader">
            <Navbar className="sidebar">
                <NavbarBrand id="leftSidebarTitle" tag={Link} to="/">GalacticCrew</NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        <NavItem className="leftSidebarItem" id="leftSidebarProfile">
                            <NavLink tag={Link} className="text-white" to="/Profile">Profile</NavLink>
                        </NavItem>
                        <NavItem className="leftSidebarItem" id="leftSidebarMissionPanel">
                            <NavLink tag={Link} className="text-white" to="/Missionpanel">Mission Panel</NavLink>
                        </NavItem>
                        <NavItem className="leftSidebarItem" id="leftSidebarMissionStatus">
                            <NavLink tag={Link} className="text-white" to="/Missionstatus">Mission Status</NavLink>
                        </NavItem>
                        <NavItem className="leftSidebarItem" id="leftSidebarMarket">
                            <NavLink tag={Link} className="text-white" to="/Market">Market</NavLink>
                        </NavItem>
                        <NavItem className="leftSidebarItem" id="leftSidebarMyShips">
                            <NavLink tag={Link} className="text-white" to="/Myships">My Ships</NavLink>
                        </NavItem>
                        <NavItem className="leftSidebarItem" leftSiderbar id="leftSidebarLogout">
                        <h5>Signed in as: {user.username}</h5>
                            <NavLink tag={Link} className="text-white" onClick={this.OnLogout} to="/">Logout</NavLink>
                        </NavItem>
                    </ul>
            </Navbar>
            <Navbar className="sidebar1">
                    <div className="rightSidebarUserName">
                        <NavLink tag={Link} to="/Profile">
                            <h4>{user.nickname}</h4>
                        </NavLink>
                    </div>
                    <div className="rightSidebarRankType">
                        <h5>{user.rankType}</h5>
                    </div>
                    <div className="rightSidebarPlayerLevel">
                    <div className="rightSidebarCircular">
                        <h5>Level</h5>
                        <CircularProgressbar value={78} text={`${user.playerLevel}`} />
                    </div>
                    </div>  
                    <div className="rightSidebarShips">                  
                    <NavLink tag={Link} to="/user/ships">
                        <h3 id="shipText">{user.shipName ? user.shipName : "no ship"}</h3>
                        <h5 id="currentShipText">Current Ship</h5>
                    </NavLink>
                    </div>     
            </Navbar>
        </header>)
    }

}

