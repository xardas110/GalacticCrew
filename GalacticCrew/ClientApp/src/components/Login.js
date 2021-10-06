import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { NavMenu } from './NavMenu';

export class Login extends Component
{
    static displayName = Login.name;

    constructor(props) {
        super(props);

        this.state = {
            userName : "",
            password: "",
            loggedIn: false
        }

        this.OnPasswordChange = this.OnPasswordChange.bind(this);
        this.OnUserNameChange = this.OnUserNameChange.bind(this);
        this.OnSubmit = this.OnSubmit.bind(this);
    
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

    async populateWeatherData() {
        const response = await fetch('Missions/AllMissions');
        const data = await response.json();
        this.setState({ forecasts: data, loading: false });
    }

    async OnSubmit(e)
    {
        e.preventDefault();

        let loginInfo = JSON.stringify(this.state);

        console.log(loginInfo);

        const response = await fetch('Api/Login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: loginInfo
            });

        if (response.status === 200) {
            const data = await response.json();
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("userName", data.userName);
            console.log("On log in submit response: ");
            console.log(data);

            this.setState({
                loggedIn: true
            });

            //To update navigation bar
            this.props.data.loggedIn(true);

        } else {
            this.setState({ loggedIn: "failed" });
        }
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
                        <button class="btn btn-success" type="submit" disabled={!this.ValidateForm()}>Login</button>
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

        let content;

        content = localStorage.getItem("loggedIn") == "true" ? this.GetLoggedInForm() : this.GetLogInForm();
        return content;
    }
}