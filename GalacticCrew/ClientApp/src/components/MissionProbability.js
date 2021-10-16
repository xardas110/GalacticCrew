import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import './MissionProbability.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export class MissionProbability extends Component {
    static displayName = MissionProbability.name;

    constructor(props) {
        super(props);

        this.state = {
            probability: 0.0,
            shipID: -1,
            missionID: -1
        };
    }

    async fetchProbability(missionID, shipID) {
        const response = await fetch('Api/MissionProbability/' + missionID + '/' + shipID + '',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        switch (response.status) {
            case 200:
            {
                const data = await response.json();
                this.setState({
                    probability: data.probability
                });
            }
            break;
            default:
            {
                this.setState({ unexpectedError: true });
            }
            break;
        }
    }

    static renderProbabilityPanel(probability) {
        return (<div className="Progress-Bar">
            <CircularProgressbar value={Math.round(probability)} text={`${Math.round(probability)}%`} />
        </div>)
    }

    render() {

        return MissionProbability.renderProbabilityPanel(this.state.probability);
    }


    componentDidMount() {
        if (this.props.shipID != this.state.shipID || this.props.missionID != this.state.missionID) {

            this.fetchProbability(this.props.missionID, this.props.shipID);

            this.setState({
                shipID: this.props.shipID,
                missionID: this.props.missionID,
            })
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.shipID != this.state.shipID || nextProps.missionID != this.state.missionID) {

            this.fetchProbability(nextProps.missionID, nextProps.shipID);

            this.setState({
                shipID: nextProps.shipID,
                missionID: nextProps.missionID
            })
        }
    }


}