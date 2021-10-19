import React, { Component } from 'react';
import { ChangeNickname } from "./ChangeNickname"
import './Profile.css';

const status = {
    null: 0,
    changeNickname: 1,
    nicknameForm: 2,
    profile: 3,
    loading: 4  
}

export class Profile extends Component {
    static displayName = Profile.name;

    constructor(props) {
        super(props)

        this.state = {
            nickName: "",
            currency: null,
            playerLevel: null,
            status: status.loading
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
                    currency: data.currency,
                    status: status.profile
                })
            } else {
                this.setState({ status: status.nicknameForm });
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

    OnClickChangeNick() {
        
    }

    OnClickChangePass() {

    }

    OnClickCheckPurchase() {

    }

    GetProfile(nickname, level, currency) {
        return (<div id="profileContainerInner">
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
                <button class="btn btn-outline-success" onClick={this.OnClickChangeNick } >Change Nickname</button>
                <button class="btn btn-outline-danger" onClick={this.OnClickChangePass} >Change Password</button>
                <button class="btn btn-outline-info" onClick={this.OnClickCheckPurchase} >Check Purchase History</button>
            </div>
        </div>)
    }

    render() {

        let content;

        switch (this.state.status) {
            case status.profile:
                {
                    content = this.GetProfile(this.state.nickName, this.state.playerLevel, this.state.currency);
                }
                break;
            case status.changeNickname:
                {
                    content = <ChangeNickname />;
                }
                break;
            case status.nicknameForm:
                {
                    content = this.GetNicknameForm();
                }
                break;
            case status.loading:
                {
                    content = <h5>loading...</h5>
                }
                break;
        }

        return (<div id="profileContainer">{content}</div>);
    }

}


