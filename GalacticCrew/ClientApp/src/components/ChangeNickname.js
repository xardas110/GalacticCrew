import React, { Component } from 'react';
import './Profile.css';

export class ChangeNickname extends Component {
    static displayName = ChangeNickname.name;

    constructor(props) {
        super(props)

        this.state = {
            nickName: "",
            hasNickname: false,
            loading: true,
            bRedirect: false
        }

        this.OnChangeNicknameForm = this.OnChangeNicknameForm.bind(this);
        this.OnSubmitNicknameForm = this.OnSubmitNicknameForm.bind(this);
    }
    
    async SubmitNickname() {

        const response = await fetch('Api/ChangeNickname',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ nickname: this.state.nickName })
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
        console.log("nickname form component mount")
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

    render() {

        let content;
        content = this.state.loading ?
                <h1>Loading.. </h1>:this.GetNicknameForm();

        return (<div id="profileContainer">{content}</div>);
    }

}


