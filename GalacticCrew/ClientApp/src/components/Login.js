import React, { Component } from 'react';
import { Next } from 'react-bootstrap/esm/PageItem';
import { Redirect } from 'react-router-dom'
import './Login.css';

export class Login extends Component
{
    static displayName = Login.name;

    constructor(props) {
        super(props);

        this.state = {
            userName : "",
            password: "",
            loggedIn: this.props.loggedIn,
            goto: false,
            bRedirectProfile: false
        }

        this.OnPasswordChange = this.OnPasswordChange.bind(this);
        this.OnUserNameChange = this.OnUserNameChange.bind(this);
        this.OnSubmit = this.OnSubmit.bind(this);    

        console.log("login constructor");
        console.log(props);

    }

    async GetOnLoginData() {

        const response = await fetch('Api/OnLogin',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            });

        console.log(response.status);

        if (response.status == 200) {
            const data = await response.json();
            return data;
        } else {
            this.setState({ bRedirectProfile: true });
            return null;
        }
    }

    async OnSubmit(e)
    {  
        e.preventDefault();
       
        let loginInfo = JSON.stringify(this.state);

        const response = await fetch('Api/Login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: loginInfo
            });

        console.log(response.status);

        if (response.status === 200) {
            var user = await this.GetOnLoginData();

            if (user != null) {
                //To update navigation bar
                console.log(user);
                user.loggedIn = true;
                this.props.setUser(user);
            }
            else {
                console.log("Failed to log in");
            }
        }
    }

    componentWillReceiveProps(nextProp) {
        console.log("componentWillReceiveProps LOGIN");
        console.log(nextProp);
    }

    componentWillUnmount() {
        console.log("componentWillUnmount LOGIN");        
    }


    GetLogInForm() {
        return(<form class="form-horizontal" onSubmit={this.OnSubmit}>
            <fieldset>
                <div id="legend">
                    <legend class="">Login</legend>
                </div>
                <div class="control-group">
                    <label class="control-label">Username</label>
                    <div class="controls">
                        <input type="text" id="username" name="username" placeholder="" class="input-xlarge" onChange={this.OnUserNameChange} />
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Password</label>
                    <div class="controls">
                        <input type="password" id="password" name="password" placeholder="" class="input-xlarge" onChange={this.OnPasswordChange} />
                    </div>
                </div>
                <div class="control-group">
                    <div class="controls">
                        <button id="logInButton" class="btn btn-success" type="submit" disabled={!this.ValidateForm()}>Login</button>
                    </div>
                </div>
                {this.state.loggedIn == "failed" ? (<h1>Failed to log in</h1>) : (<h1></h1>)}
            </fieldset>
        </form>);
    }

    GetLoggedInForm() {
        return (<h1>SuccessFully logged in</h1>)
    }

    render() {

        if (this.state.loggedIn)
            return (<Redirect to="/profile" />);

        if (this.state.bRedirectProfile)
            return (<Redirect to="/profile" />);

        let content;
        content = this.state.loggedIn ? this.GetLoggedInForm() : this.GetLogInForm();
        return (<div id="profileContainer">{content}</div>);
    }

    OnUserNameChange(e) {
        this.setState({
            userName: e.target.value
        });
    }

    OnPasswordChange(e) {
        this.setState({
            password: e.target.value
        });
    }


    ValidateForm() {
        return this.state.password && this.state.userName;
    }

}