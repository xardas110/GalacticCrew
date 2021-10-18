import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Container } from 'react-bootstrap';
import { MissionInformation } from "./MissionInformation"
import './ShipInformationPanel.css';

export class ShipInformationPanel extends Component {
    static displayName = ShipInformationPanel.name;

    constructor(props) {
        super(props);

        this.state = {
            shipData: {},
            hasShips: false,
            unexpectedError:false
        };
    }

    async fetchShipByID(shipID) {

        if (this.state.shipData.shipID == shipID)
            return;

        const response = await fetch('Api/MyShips/' + shipID+ '',
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
                        shipData: data,
                        hasShips: true
                    });

                    if (this.props.shipInformationCallback)
                        this.props.shipInformationCallback(data);
                }
                break;
            case 204:
                {
                    this.setState({ hasShips: false })
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
        if (this.props.hasShipID && this.props.shipID != this.state.shipID) {
            this.fetchShipByID(this.props.shipID);
        }
    }

    componentWillReceiveProps(nextProp, nextState) {
        if (nextProp.hasShipID && nextProp.shipID != this.state.shipID) {
            this.fetchShipByID(nextProp.shipID);
        }
    }

    static renderShipInformation(shipData) {
        return (<div className="shipInfo">
            <h3 className="infoText">Name:</h3>
            <h3 className="statusText">{shipData.shipTitle}</h3>
            <h3 className="infoText">Type:</h3>    
            <h3 className="statusText">{shipData.shipType}</h3>
            <h3 className="infoText">Fuel:</h3>
            <h3 className="statusText">{shipData.shipFuelCapacity}</h3>
            <h3 className="infoText">Level:</h3>
            <h3 className="statusText">{shipData.shipLevel}</h3>
        </div>)
    }

    render() {  
        let content = this.state.hasShips ? ShipInformationPanel.renderShipInformation(this.state.shipData) : (<h1></h1>)
        return content;
    }

}