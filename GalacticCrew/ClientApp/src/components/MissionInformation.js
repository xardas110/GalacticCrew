import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';

export class MissionInformation extends Component {
    static displayName = MissionInformation.name;

    constructor(props) {
        super(props)

        this.state = {
            missionInformation: {}
        }
        this.fetchMissionInformation = this.fetchMissionInformation.bind(this);
    }


    async fetchMissionInformation(missionID) {
        const response = await fetch('Api/MissionInformation/'+missionID+'',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        if (response.status == 200) {
            const data = await response.json();

            this.setState({ missionInformation: data })
        }
    }

    componentDidMount(props) {
        console.log(this.props);
        this.fetchMissionInformation(this.props.selectedRow.missionID);
    }

    render() {
        //let content = this.state.LoggedIn ? this.welcome(this.state.UserName) : "You are not logged in"
    return (
        <div>
            <Container>
                <h1>{this.state.missionInformation.missionTitle}</h1>
                <p>{this.state.missionInformation.missionDesc}</p>
                <p>Mission Rank: {this.state.missionInformation.missionRank}</p>
                <p>Mission Type: {this.state.missionInformation.missionType}</p>
                <p>Mission Distance: {this.state.missionInformation.missionDistance}</p>
                <p>Mission time: {this.state.missionInformation.missionTime}</p>
                <p>Mission Reward: {this.state.missionInformation.missionReward}</p>
            </Container>
            <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick={this.props.AcceptMission}>
                    Accept Mission
                </Button>
                <Button variant="secondary" size="lg" onClick={this.props.BackToMissionPanel}>
                    Back to mission panel
                </Button>
            </div>
      </div>
    );
    }

}


