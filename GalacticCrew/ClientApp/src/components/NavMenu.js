import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

    constructor(props)
    {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.OnLogout = this.OnLogout.bind(this);

        this.state = {
            loggedIn:false,
            collapsed: true,
        };

        console.log("navmenu logger:");
        console.log(props);
    }

    toggleNavbar () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    OnLogout(e) {
        const response = fetch('Api/Logout',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log("Onlogout running");

        localStorage.setItem("loggedIn", false);
        localStorage.setItem("userName", null);
        console.log("Onlogout await response");
        this.setState({ loggedIn: false });
      
    }


    GetLoggedOut() {  
        return (<header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/">GalacticCrew</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/Missionpanel">Mission Panel(only for testing)</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/Login">Login</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/Register">Register</NavLink>
                            </NavItem>
                        </ul>
                    </Collapse>
                </Container>
            </Navbar>
        </header>)
    }

    GetLoggedIn(username) {
        return (
          <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/">GalacticCrew</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/Missionpanel">Mission Panel(only for testing)</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/Profile">Signed in as: {username}</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" onClick={this.OnLogout } to="/">Logout</NavLink>
                            </NavItem>                          
                        </ul>                   
                    </Collapse>
                </Container>
            </Navbar>
        )
    }
    GetNewSideBarLoggedOut() {
        return (<header className="mainheader">
            <Navbar className="sidebar">
                <Container>
                    <NavbarBrand tag={Link} to="/">GalacticCrew</NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/Missionpanel">Mission Panel(only for testing)</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/Login">Login</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/Register">Register</NavLink>
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

    GetNewSideBarLoggedIn(userName) {
        return (<header className="mainheader">
            <Navbar className="sidebar">
            <Container>
                <NavbarBrand tag={Link} to="/">GalacticCrew</NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/Missionpanel">Mission Panel(only for testing)</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/Profile">Signed in as: {userName}</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" onClick={this.OnLogout} to="/">Logout</NavLink>
                        </NavItem>
                    </ul>                   
            </Container>
            </Navbar>
            <Navbar className="sidebar1">
                <Container>
                    <NavLink tag={Link} to="/Profile"><h1>{userName}</h1></NavLink>
                    <ul className="navbar-nav flex-grow">
                    </ul>
                </Container>
            </Navbar>
        </header>)              
    }



    render() {
        let content;


        if (localStorage.getItem("loggedIn") == "true") {
            content = this.GetNewSideBarLoggedIn(localStorage.getItem("userName"));
        }
        else {
            content = this.GetNewSideBarLoggedOut();
        }
        return content;       
    }
}

