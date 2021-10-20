import React, { Component, useState } from 'react';
import { Redirect } from 'react-router-dom'


const status =
{
    registerFailed: 1,
    registerSuccess: 2,
    registerForm: 3,
    redirectLogin: 4,
    redirectProfile: 5,
    unexpectedError: 6,
    loggedIn: 7
}

export class Register extends Component
{
    static displayName = Register.name;
    constructor(props) {
        super(props);

        this.state = {
            userName : "",
            password : "",
            confirmPassword: "",
            status: status.registerForm        
        }
        
        this.OnPasswordChange = this.OnPasswordChange.bind(this);
        this.OnPasswordConfirmChange = this.OnPasswordConfirmChange.bind(this);
        this.OnUserNameChange = this.OnUserNameChange.bind(this);
        this.onRegisterSubmit = this.onRegisterSubmit.bind(this);
        this.fetchRegister = this.fetchRegister.bind(this);

        this.registerStatus = React.createRef();       
    }

    async fetchRegister(username, password) {

        const response = await fetch('Api/Register',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: username,
                    password: password
                })
            });

        console.log(response.status);

        switch (response.status) {
            case 200:
                {
                    this.setState({ status: status.registerSuccess });
                }
                break;
            case 400:
                {
                    this.setState({ status: status.registerFailed });
                }
                break;
            default:
                {
                    this.setState()
                    console.log("Register failed");
                }
                break;
        }
    }

    async onRegisterSubmit(e) {
        e.preventDefault();
        this.fetchRegister(this.state.userName, this.state.password);
    }

    componentDidMount() {
        if (this.props.loggedIn) {
            this.setState({ status: status.loggedIn });
        }
    }

    renderRegisterForm() {
        return(<div><form class="form-horizontal" onSubmit={this.onRegisterSubmit}>
            <fieldset>
                <div id="legend">
                    <legend class="">Register</legend>
                </div>
                <div class="control-group">

                    <label class="control-label" for="username">Username</label>
                    <div class="controls">
                        <input type="text" id="username" name="username" placeholder="" class="input-xlarge" onChange={this.OnUserNameChange} />
                        <p class="help-block">Username can contain any letters or numbers, without spaces</p>
                    </div>
                </div>
                <div class="control-group">

                    <label class="control-label" for="password">Password</label>
                    <div class="controls">
                        <input type="password" id="password" name="password" placeholder="" class="input-xlarge" onChange={this.OnPasswordChange} />
                        <p class="help-block">Password should be at least 4 characters</p>
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="password_confirm">Password (Confirm)</label>
                    <div class="controls">
                        <input type="password" id="password_confirm" name="password_confirm" placeholder="" class="input-xlarge" onChange={this.OnPasswordConfirmChange} />
                        <p class="help-block">Please confirm password</p>

                    </div>
                </div>
                <div class="control-group">
                    <div class="controls">
                        <button id="logInButton" class="btn btn-success" type="submit" /*disabled={!this.ValidateForm()}*/>Register</button>
                    </div>
                </div>
            </fieldset>
        </form>
            <h1 ref={this.registerStatus}></h1>
        </div>)
    }

    render() {

        let content;

        if (this.props.loggedIn)
            return <Redirect to="/Profile"/>

        if (this.bRegister) {
            setTimeout(e => { return(<Redirect to="/Login"/>) }, 1000)
        }

        switch (this.state.status) {
            case status.redirectProfile:
                {
                    return (<Redirect to="/Profile" />);
                }
                break;
            case status.redirectLogin:
                {
                    return (<Redirect to="/Login" />);
                }
                break;
            case status.registerForm:
                {
                    content = this.renderRegisterForm();
                    
                }
                break;
            case status.registerSuccess:
                {
                    content = <h1>Successfully registered! Redirecting to login page...</h1>;
                    setTimeout(p => { this.setState({ status: status.redirectLogin }) }, 2000);
                }
                break;
            case status.registerFailed:
                {
                    content = this.renderRegisterForm();
                    this.registerStatus.current.innerHTML = "Username already exist or password too weak";
                    setTimeout(p => { this.registerStatus.current.innerHTML = ""; this.setState({ status: status.registerForm }); }, 4000);
                }
                break;
            case status.loggedIn:
                {
                    return (<Redirect to="/Profile" />);
                }
                break;
        }



        return (<div id="profileContainer">{content}</div>)
            
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

    OnPasswordConfirmChange(e) {
        this.setState({
            confirmPassword: e.target.value
        });
    }


    ValidateForm() {
        return this.state.password === this.state.confirmPassword && this.state.userName.length > 2 && this.state.password.length > 2;
    }
}