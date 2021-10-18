import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import './MissionInformation.css';


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
        const columns = [{
            dataField: 'missionTitle',
            text: 'Title',
            sort: true
        }, {
            dataField: 'missionType',
            text: 'Type',
            sort: true
        }, {
            dataField: 'missionRank',
            text: 'Rank',
            sort: true
        }, {
            dataField: 'missionReward',
            text: 'Reward',
            sort: true
        }, {
            dataField: 'missionDistance',
            text: 'Distance',
            sort: true
            }];

        console.log(this.state.missionInformation);

        return (<div id="missionInfoContainer">
            <Container id = "missionInfoTableContainer">
                <BootstrapTable responseive="sm" id="missionInfoTable" headerClasses="hc" rowClasses="rc" keyField="missionTitle" data={[this.state.missionInformation]} columns={columns} />
                <h1> </h1>
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


