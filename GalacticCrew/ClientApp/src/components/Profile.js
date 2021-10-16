import React, { Component } from 'react';
import './Profile.css';

export class Profile extends Component {
    static displayName = Profile.name;

    constructor(props) {
        super(props)

        this.state = {
            nickName: "",
            currency: null,
            playerLevel: null,
            hasNickname:false
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.OnChangeNicknameForm = this.OnChangeNicknameForm.bind(this);
        this.OnSubmitNicknameForm = this.OnSubmitNicknameForm.bind(this);
    }
    async FetchUserData() {

        const response = await fetch('Api/Profile',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            });

        if (response.status == 200) {
            const data = await response.json();
            console.log("Response ok inside fetch profile data");
            console.log(data);
            if (data.nickName != null) {
                this.setState({
                    nickName: data.nickName,
                    playerLevel: data.playerLevel,
                    currency:data.currency,
                    hasNickname: true
                })
            }

        } else {
            console.log("profile fetch failed response");
            console.log(response.status);
        }

    }

    async SubmitNickname() {

        const response = await fetch('Api/CreatePlayer',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ userName: this.state.nickName })
            });

        if (response.status === 200) {

            console.log("Ok submit nickname");
            this.FetchUserData();
        }
        else {
            console.log("failed to submit username")
            console.log(response.status);
        }
    }

    componentDidMount() {
        console.log("profile component mount")
        this.FetchUserData();
    }

    OnChangeNicknameForm(e) {
        this.setState({ nickName: e.target.value });
        console.log(this.state.nickName);
    }

    OnSubmitNicknameForm(e) {
        e.preventDefault();
        this.SubmitNickname();
    }

    GetNicknameForm() {
        return (<form onSubmit={this.OnSubmitNicknameForm}>
            <div class="form-group">
                <label for="NickName">Enter nickname:</label>
                <input type="text" class="form-control" aria-describedby="nickhelp" onChange={this.OnChangeNicknameForm } placeholder="Enter Nickname" />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>)
    }

    GetProfile(nickname, level, currency) {
        return (<div id="profileContainer">
            <div id="textContainer">
                <h4 > Nickname:</h4>              
                <h4 > Level:</h4>                           
                <h4 > Currency:</h4>              
            </div>
            <div id="varContainer">
                <h4 > {nickname}</h4> 
                <h4 > {level}</h4> 
                <h4 > {currency}</h4> 
            </div>
            <div id="buttonContainer">
                <button class="btn btn-outline-success">Change Nickname</button>
                <button class="btn btn-outline-danger">Change Password</button>
                <button class="btn btn-outline-info">Check Purchase History</button>
            </div>
        </div>)
    }

    render() {

        let content;
        content = this.state.hasNickname ? this.GetProfile(this.state.nickName, this.state.playerLevel, this.state.currency) : this.GetNicknameForm();

        return content;
    }

}


