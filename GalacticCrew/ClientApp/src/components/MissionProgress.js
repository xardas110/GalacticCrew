import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Redirect } from 'react-router-dom'
import "./MissionProgress.css";
const missionStatus =
{
    Null:"Null",
    InProgress: "InProgress",
    Finished: "Finished",
    Complete: "Complete"
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
            missionStatus: missionStatus.Null,
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
                    this.setState({ missionStatus: missionStatus.Complete });
                }
                break;
            case 204:
                {
                }
                break;
            default:
                {
                    this.setState({ unexpectedError: true });
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
            this.setState({ missionStatus: missionStatus.Finished });
        }
    }

    OnCompleteMission() {
        this.fetchCompleteMission();
    }

    render() {

        if (this.state.missionStatus == missionStatus.Complete) {
            return (<Redirect to="/MissionPanel" />)
        }

        return (<div className="missionProgressMain">
            <div className="missionProgressTitle">
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
                <Button variant="primary" size="lg" onClick={this.OnCompleteMission} hidden={!(this.state.missionStatus == missionStatus.Finished)}>
                    Complete Mission
                </Button>
                <Button variant="primary" size="lg" onClick={this.props.cancelMissionCallback}>
                    Cancel Mission
                </Button>
            </div>
        </div>)
    }


}