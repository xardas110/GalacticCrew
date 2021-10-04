import React, { Component } from 'react';


export class Login extends Component
{
    static displayName = Login.name;

    constructor(props) {
        super(props);

        this.state = {
            userName : "",
            password : "",
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

    async OnSubmit()
    {
        const response = await fetch('Api/Login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            });

        const data = await response.json();

        console.log(data);

        localStorage.setItem('GalacticCrew', JSON.stringify(data));

        let storeage = JSON.parse(localStorage.getItem('GalacticCrew'))
        console.log(storeage);
    }

    render() {
        return (
            <form class="form-horizontal" method="post" action="Api/Login">
            <fieldset>
                <div id="legend">
                    <legend class="">Login</legend>
                </div>
                <div class="control-group">
                    <label class="control-label">Username</label>
                        <div class="controls">
                            <input type="text" id="username" name="username" placeholder="" class="input-xlarge" onChange={ this.OnUserNameChange } />         
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
            </fieldset>
        </form>)
    }
}