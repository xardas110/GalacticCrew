import React, { Component, useState } from 'react';
import { Redirect } from 'react-router-dom'

export class Register extends Component
{
    static displayName = Register.name;
    constructor(props) {
        super(props);

        this.state = {
            userName : "",
            password : "",
            confirmPassword: "",
            bRegister: false        
        }
        
        this.OnPasswordChange = this.OnPasswordChange.bind(this);
        this.OnPasswordConfirmChange = this.OnPasswordConfirmChange.bind(this);
        this.OnUserNameChange = this.OnUserNameChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
       
    }

    async onSubmit(e) {

        e.preventDefault();
        
        const response = await fetch('Api/Register',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: this.state.userName,
                    password: this.state.password
                })
            });

        console.log(response.status);

        if (response.status === 200) {              
            this.setState({ bRegister: true });   
        }    
    }


    render() {

        if (this.props.loggedIn)
            return <Redirect to="/Profile"/>

        if (this.bRegister) {
            setTimeout(e => { return(<Redirect to="/Login"/>) }, 1000)
        }

        return (
            <form class="form-horizontal" onSubmit={this.onSubmit}>
            <fieldset>
                <div id="legend">
                    <legend class="">Register</legend>
                </div>
                <div class="control-group">

                    <label class="control-label" for="username">Username</label>
                        <div class="controls">
                            <input type="text" id="username" name="username" placeholder="" class="input-xlarge" onChange={ this.OnUserNameChange } />         
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
                            <button class="btn btn-success" type="submit" /*disabled={!this.ValidateForm()}*/>Register</button>
                        </div>
                        {this.state.bRegister?(<h1>Success! Redirecting in 2 sec...</h1>):(<h1></h1>)}
                </div>
            </fieldset>
            </form>)
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