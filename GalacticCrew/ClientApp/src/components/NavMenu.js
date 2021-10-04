import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

      this.toggleNavbar = this.toggleNavbar.bind(this);
      let string = localStorage.getItem('GalacticCrew');
    this.state = {
        collapsed: true,
        token: string?JSON.parse(localStorage.getItem('GalacticCrew')).token:null
      };

      this.ResetCookie = this.ResetCookie.bind(this);

  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

    ResetCookie() {
        localStorage.removeItem('GalacticCrew');
        Redirect('/');
    }

    render() {

        let content = this.state.token ?
            (<header>
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
                                    <NavLink tag={Link} onClick={this.ResetCookie()} className="text-dark" to="/Home">Sign out</NavLink>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>) :
            <header>
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
            </header>


        return (
            content
    );
    }


}
