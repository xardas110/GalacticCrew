import React, { Component } from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Button, Container } from 'react-bootstrap';
import './MyShips.css';
import { MyShipsPanel } from './MyShipsPanel';
import { ShipInformationPanel } from './ShipInformationPanel';
import { Market } from './Market';

const status = {
    Null: "Null",
    shipBought: "shipBought"
}

export class MyShips extends Component {
    static displayName = MyShips.name;

    constructor(props) {
        super(props)

        this.state = {
            hasShipID: false,
            shipID: -1,
            selecteRow: {},
            shipInformation: {},
            playerCurrency: -1,
            unexpectedError: false,
            shipData: {}
        }

        this.rowCallBackFunc = this.rowCallBackFunc.bind(this);
        this.ShipInformation = this.ShipInformation.bind(this);
        this.OnUpgradeShip = this.OnUpgradeShip.bind(this);
        this.fetchUpgradeShip = this.fetchUpgradeShip.bind(this);
        console.log("Myships constructor");
        console.log(this.props);
    }

    async componentDidMount() {
        console.log("Myships componentDidMount");
        console.log(this.props);

        this.setState({ playerCurrency: this.props.playerCurrency });

        let currency = await Market.FetchPlayerCurrency();

        if (this.state.playerCurrency != currency) {
            this.setState({ playerCurrency: currency });
        }      
    }

    rowCallBackFunc(row, isSelected) {
        this.setState({ hasShipID: true, shipID: row.shipID, selecteRow: row });
        this.fetchMyShipInformation(row.shipID);
        console.log(row);
    }

    ShipInformation(info) {
        if (this.state.shipInformation.shipID != info.shipID) {
            this.setState({ shipInformation: info });
        }
    }

    async fetchMyShipInformation(shipID) {
        const response = await fetch('Api/myshipinformation/'+shipID+'',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        switch (response.status) {
            case 200:
                {
                    const data = await response.json();
                    this.setState({ shipData:data });
                    console.log(data);
                }
                break;
            default:
                {
                    console.log("Failed to get ship information");
                }
                break;
        }
    }

    async fetchUpgradeShip(shipID) {
        const response = await fetch('Api/UpgradeShip/'+shipID+'',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);
        console.log(response);
        switch (response.status) {
            case 200:
                {
                    var newValue = await Market.FetchPlayerCurrency()                  
                    this.setState({ playerCurrency: newValue });
                    this.fetchMyShipInformation(this.state.shipID);
                }
                break;
            default:
                {
                    this.setState({ unexpectedError: true });
                }
                break;
        }
    }

    OnUpgradeShip() {
        this.fetchUpgradeShip(this.state.shipID);
    }

    render() {
        console.log("shipinformatin in myships");
        console.log(this.state.shipInformation);
        return (<div id="myShipsContainer">
            <div id="myShipsHeader">
                <h1>Spacecrafts Owned</h1>
            </div>
            <div id="myShipPanel">
                <MyShipsPanel hasRowCallback={true} rowCallback={this.rowCallBackFunc} />           
            </div>
            <div id="myShipInformationPanel">
                {this.state.hasShipID ? ShipInformationPanel.renderMyShipInformation(this.state.shipData):<h1></h1>}
            </div>
            <div className="upgradeContainer">
                <h1 id>Your money: {this.state.playerCurrency}</h1>
                <Button variant="primary" size="lg" onClick={this.OnUpgradeShip} disabled={!this.state.hasShipID}>
                    Upgrade ship
                </Button>
            </div>
        </div>)
    }
}


