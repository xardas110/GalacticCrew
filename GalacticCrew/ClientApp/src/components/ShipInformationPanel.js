import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Container } from 'react-bootstrap';
import { MissionInformation } from "./MissionInformation"
import './ShipInformationPanel.css';

const marketColumns = [{
    dataField: 'shipTitle',
    text: 'Ship Name',
    sort: true
}, {
    dataField: 'shipType',
    text: 'Type',
    sort: true
}, {
    dataField: 'shipFuelCapacity',
    text: 'Fuel Capacity',
    sort: true
},{
    dataField: 'shipCost',
    text: 'Cost',
    sort: true
    }];

const myShipsColumns = [{
    dataField: 'shipName',
    text: 'Ship Name',
    sort: true
}, {
    dataField: 'shipType',
    text: 'Type',
    sort: true
}, {
    dataField: 'shipFuelCapacity',
    text: 'Fuel Capacity',
    sort: true
}, {
    dataField: 'shipLevel',
    text: 'Level',
    sort: true
},
{
    dataField: 'shipUpgradeCost',
    text: 'Upgrade Cost',
    sort: true
}];

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

    static renderShipInformation(shipData, columns, keyField) {
        return (<Container id="missionInfoTableContainer">
            <BootstrapTable responseive="sm" id="missionInfoTable" headerClasses="hc1" rowClasses="rc1" keyField={keyField } data={[shipData]} columns={columns} />
            </Container>
        )
    }

    static renderMyShipInformation(shipData) {
        return (<Container id="missionInfoTableContainer">
            <BootstrapTable responseive="sm" id="missionInfoTable" headerClasses="hc" rowClasses="rc" keyField="shipName" data={[shipData]} columns={myShipsColumns} />
        </Container>
        )
    }

    render() {  
        let content = this.state.hasShips ? ShipInformationPanel.renderShipInformation(this.state.shipData, marketColumns, "shipTitle") : (<h1></h1>)
        return content;
    }

}