import React, { Component, useState } from 'react';


export class Register extends Component
{
    static displayName = Register.name;
    constructor(props) {
        super(props);

        this.state = {
            userName : "userName",
            password : "1",
            confirmPassword : "",
        }

        this.OnPasswordChange = this.OnPasswordChange.bind(this);
        this.OnPasswordConfirmChange = this.OnPasswordConfirmChange.bind(this);
        this.OnUserNameChange = this.OnUserNameChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
        return this.state.password === this.state.confirmPassword && this.state.userName.length > 2;
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

        const data = await response.json();
    }


    render() {

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
                </div>
            </fieldset>
        </form>)
    }
}