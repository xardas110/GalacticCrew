import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Redirect } from 'react-router-dom'
import "./MissionProgress.css";

const status =
{
    null:0,
    inProgress: 1,
    finished: 2,
    complete: 3,
    redirectMissionPanel: 4,
    unexpectedError: 5,
    failed: 6,
    redirectMyShips: 7,
    redirectProfile: 8
}

export class MissionProgress extends Component {
    static displayName = MissionProgress.name;

    constructor(props) {
        super(props);

        this.state = {
            missionStartDate: 0.0,
            missionDuration: 0.0,
            missionTitle: "",
            delta: 0.0,
            timer: setInterval(() => { this.MissionTimer() }, 1000),
            status: status.inProgress,
            unexpectedError: false,
            timeLeft: 0
        };
        this.MissionTimer = this.MissionTimer.bind(this);
        this.fetchCompleteMission = this.fetchCompleteMission.bind(this);
        this.OnCompleteMission = this.OnCompleteMission.bind(this);
    }

    async fetchCompleteMission() {
        const response = await fetch('Api/CompleteMission',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        switch (response.status) {
            case 200:
                {
                    this.setState({ status: status.complete });
                }
                break;
            case 400:
                {
                    this.setState({status:status.failed});
                }
                break;
            default:
                {
                    this.setState({ status: status.unexpectedError });
                }
                break;
        }
    }

    componentDidMount() {
        console.log("componentDidMount missionsprogress");
        console.log(this.props);
        if (this.props.missionStartDate != this.state.missionStartDate || this.props.missionDuration != this.state.missionDuration) {
            this.setState({
                missionStartDate: this.props.missionStartDate,
                missionDuration: this.props.missionDuration,
                missionTitle: this.props.missionTitle
            })
        }
    }
    componentWillUnmount() {
        clearInterval(this.state.timer);
    }
    componentWillReceiveProps(props) {
        console.log("componentWillReceiveProps missionsprogress");
        console.log(props);
        if (props.missionStartDate != this.state.missionStartDate || props.missionDuration != this.state.missionDuration) {
            this.setState({
                missionStartDate: props.missionStartDate,
                missionDuration: props.missionDuration,
                missionTitle: props.missionTitle
            })
        }
    }

    MissionTimer() {
        console.log("missiontimer running");
        var missionDate = new Date(this.state.missionStartDate);
        var missionStartTime = missionDate.getTime();
        var missionDuration = this.state.missionDuration * 1000;
        var TimeElapsed = Date.now() - missionStartTime;
        var delta = (TimeElapsed / missionDuration) > 1.0 ? 1.0 : (TimeElapsed / missionDuration);
        this.setState({ delta: delta, timeLeft: "(" + Math.round((missionDuration - TimeElapsed) / 60000) + ")" + " Minutes" });

        if (delta >= 1.0) {
            clearInterval(this.state.timer);
            this.setState({ status: status.finished, timeLeft:(0) + "Minutes" });
        }
    }

    OnCompleteMission() {
        this.fetchCompleteMission();
    }

    renderMissionInProgress() {
        return (<div><div className="missionProgressTitle">
                <h1>Mission in progress: {this.state.missionTitle}</h1>
            </div>
            <div id="inFlightImageContainer">
                <img src="https://media.giphy.com/media/gEwrCXUgVijde/giphy.gif" />
            </div>
            <div id="progressBarContainer">
                <h5>Time Left: {this.state.timeLeft}</h5>
                <ProgressBar now={this.state.delta * 100} label={this.state.delta * 100 + "%"} />
            </div>
            <div id="completeMissionButton">
                <Button variant="primary" size="lg" onClick={this.OnCompleteMission} hidden={!(this.state.status == status.finished)}>
                    Complete Mission
                </Button>
                <Button variant="primary" size="lg" onClick={this.props.cancelMissionCallback} hidden={this.state.status == status.finished}>
                    Cancel Mission
                </Button>
            </div>
        </div>)     
    }

    render() {

        let content;

        switch (this.state.status) {
            case status.inProgress:
                {
                    content = this.renderMissionInProgress();
                }
                break;
            case status.finished:
                {
                    content = this.renderMissionInProgress();
                }
                break;
            case status.complete:
                {
                    content = (<div className="missionStatusText">
                        <h1>Mission Success!!</h1>
                        <h3>You have been rewarded currency and XP</h3>
                        <Button variant="primary" size="lg" onClick={e => { this.setState({ status: status.redirectMissionPanel }) }}>
                            Go Mission Panel
                        </Button>
                        <Button variant="primary" size="lg" onClick={e => { this.setState({ status: status.redirectMyShips }) }}>
                            Go WorkShop
                        </Button>
                    </div>);
                }
                break;
            case status.redirectMyShips:
                {
                    return (<Redirect to="/MyShips"/>)
                }
                break;
            case status.redirectMissionPanel:
                {
                    return (<Redirect to="/missionpanel" />)
                }
                break;
            case status.failed:
                {
                    content = (<div className="missionStatusText">
                        <h1>Mission Failed!!</h1>
                        <h3>No currency or XP rewarded :(</h3>
                        <Button variant="primary" size="lg" onClick={e => { this.setState({ status: status.redirectMissionPanel }) }}>
                            Go Mission Panel
                        </Button>
                        <Button variant="primary" size="lg" onClick={e => { this.setState({ status: status.redirectMyShips }) }}>
                            Go WorkShop
                        </Button>
                    </div>);
                }
                break;
            default:
                {
                    content = (<h1>Hmm smth is wrong</h1>);
                }
                break;
        }

        return (<div className="missionProgressMain">
            {content}
        </div>)
    }


}