import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import './Profile.css';

const status =
{
    changeNicknameAccepted: 1,
    changeNicknameFailed: 2,
    changeNicknameForm: 3,
    redirectProfile:4
}

export class ChangeNickname extends Component {
    static displayName = ChangeNickname.name;

    constructor(props) {
        super(props)

        this.state = {
            nickName: "",
            status: status.changeNicknameForm
        }

        this.statusRef = React.createRef();
        this.renderNicknameForm = this.renderNicknameForm.bind(this);
        this.OnChangeNicknameForm = this.OnChangeNicknameForm.bind(this);
        this.OnSubmitNicknameForm = this.OnSubmitNicknameForm.bind(this);
        this.SubmitNickname = this.SubmitNickname.bind(this);
    }
    
    async SubmitNickname() {

        const response = await fetch('Api/ChangeNickname',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ nickname: this.state.nickName })
            });


        switch (response.status) {
            case 200:
                {
                    console.log("Ok submit nickname");
                    this.setState({ status: status.changeNicknameAccepted });
                }
                break;
            default:
                {
                    console.log("failed to submit username")
                    console.log(response.status);
                    this.setState({ status: status.changeNicknameFailed });
                }
                break;
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

    renderNicknameForm() {
        return (<form onSubmit={this.OnSubmitNicknameForm}>
            <div class="form-group">
                <label for="NickName">Enter nickname:</label>
                <input type="text" class="form-control" aria-describedby="nickhelp" onChange={this.OnChangeNicknameForm} placeholder="Enter Nickname" />
                <h1 id="changeNicknameStatus" ref={this.statusRef}></h1>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>)
    }

    render() {

        let content;

        switch (this.state.status) {
            case status.changeNicknameForm:
                {
                    content = this.renderNicknameForm();
                }
                break;
            case status.changeNicknameAccepted:
                {
                    content = this.renderNicknameForm();
                    console.log("props in changenickname form");
                    console.log(this.props);
                    this.props.setNickname(this.state.nickName);
                    this.statusRef.current.innerHTML = "Success!";
                    setTimeout(e => { this.setState({ status: status.redirectProfile }) }, 2000);
                }
                break;
            case status.changeNicknameFailed:
                {
                    content = this.renderNicknameForm();
                    this.statusRef.current.innerHTML = "Nickname already exist!";
                }
                break;
            case status.redirectProfile:
                {
                    return (<Redirect to="/Profile" />);
                }
                break;
            default:
                {
                    content = (<h1>Unexpected error</h1>);
                }
                break;
        }

        return content;
    }
}


