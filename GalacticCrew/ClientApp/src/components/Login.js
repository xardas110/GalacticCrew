import React, { Component } from 'react';
import { Next } from 'react-bootstrap/esm/PageItem';
import { Redirect } from 'react-router-dom'
import './Login.css';

const status =
{
    null: 0,
    redirectProfile: 1,
    loginForm: 2,
    loggedInForm: 3,
    unexpectedError:4
}


export class Login extends Component
{
    static displayName = Login.name;

    constructor(props) {
        super(props);

        this.state = {
            userName : "",
            password: "",
            status: status.loginForm,
            bWrongPassword: false
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

        switch (response.status) {
            case 200:
                {
                    const data = await response.json();
                    return data;
                }
                break;
            case 422:
                {
                    console.log("Database error");
                    return -1;
                }
                break;
            default:
                {
                    return null;
                }
        }
    }

    async FetchLogin() {
        let loginInfo = JSON.stringify(this.state);

        const response = await fetch('Api/Login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: loginInfo
            });

        console.log(response.status);

        switch (response.status) {
            case 200:
                {
                    var user = await this.GetOnLoginData();

                    if (user != null) {
                        console.log(user);
                        user.loggedIn = true;
                        //To update navigation bar
                        this.props.setUser(user);
                        this.setState({ status: status.redirectProfile });
                    }
                    else {
                        this.setState({ status: status.unexpectedError });
                    }
                }
                break;
            case 401:
                {
                    this.setState({ bWrongLogin: true });
                }
                break;
            default:
                {
                    console.log("database error");
                }
                break;
        }
    }

    async OnSubmit(e)
    {  
        e.preventDefault();
        this.FetchLogin();       
    }

    componentDidMount() {
        if (this.props.loggedIn) {
            this.setState({ status: status.redirectProfile });
        }
    }

    componentWillReceiveProps(nextProp) {
        console.log("componentWillReceiveProps LOGIN");
        console.log(nextProp);
    }

    componentWillUnmount() {
        console.log("componentWillUnmount LOGIN");        
    }

    render() {

        let content;
        switch (this.state.status) {
            case status.redirectProfile:
                {
                    return (<Redirect to="/profile" />);
                }
                break;
            case status.loginForm:
                {
                    content= this.GetLogInForm();
                }
                break;
            case status.loggedInForm:
                {
                    content = this.GetLoggedInForm();
                }
                break;
            default:
                {
                    content = <h1>Smth went really wrong</h1>
                }
                break;
        }

        return (<div id="profileContainer">{content}</div>);
    }

    GetLogInForm() {
        return (<form class="form-horizontal" onSubmit={this.OnSubmit}>
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