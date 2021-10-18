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
            unexpectedError:false
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
        console.log(row);
    }

    ShipInformation(info) {
        if (this.state.shipInformation.shipID != info.shipID) {
            this.setState({ shipInformation: info });
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
                    var newValue = this.state.playerCurrency - this.state.shipInformation.shipUpgradeCost;
                    this.setState({ playerCurrency: newValue });
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
        this.fetchUpgradeShip(this.state.shipInformation.shipID);
    }

    render() {
        return (<div id="myShipsContainer">
            <div id="myShipsHeader">
                <h1>Spacecrafts Owned</h1>
            </div>
            <div id="myShipPanel">
                <MyShipsPanel hasRowCallback={true} rowCallback={this.rowCallBackFunc} />           
            </div>
            <div id="myShipInformationPanel">
                <ShipInformationPanel hasShipID={this.state.hasShipID} shipID={this.state.shipID} shipInformationCallback={this.ShipInformation} />
            </div>
            <div className="upgradeContainer">
                <h1 id="UpgradeCost">{this.state.shipInformation.shipUpgradeCost}</h1>
                <h1 id>{this.state.playerCurrency}</h1>
                <Button variant="primary" size="lg" onClick={this.OnUpgradeShip} disabled={!this.state.hasShipID}>
                    Upgrade ship
                </Button>
            </div>
        </div>)
    }
}


