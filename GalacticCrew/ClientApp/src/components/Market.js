import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import { MissionProbability } from './MissionProbability';
import { MyShipsPanel } from './MyShipsPanel';
import { ShipInformationPanel } from './ShipInformationPanel';
import './Market.css';
import { MissionProgress } from './MissionProgress';

const status = {
    Null: "Null",
    shipBought:"shipBought"
}

export class Market extends Component {
    static displayName = Market.name;

    constructor(props) {
        super(props)      

        this.state = {
            shipData: [],
            selectedRow: {},
            hasShipID: false,
            shipID: -1,
            playerCurrency: -1,
            marketStatus: status.shipBought
        }

        this.OnRowSelect = this.OnRowSelect.bind(this);
        this.OnBuyShip = this.OnBuyShip.bind(this);
        this.ShipInformation = this.ShipInformation.bind(this);
    }

    async fetchMarket() {
        const response = await fetch('Api/Market',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        switch (response.status) {
            case 200:
                {
                    const data = await response.json();
                    this.setState({ shipData: data, marketStatus: status.shipBought });                 
                }
                break;
            default:
                {
                    this.setState({ unexpectedError: true });
                }
                break;
        }
    }

    async fetchBuyShip(shipID) {
        const response = await fetch('Api/Market/buy/'+shipID+'',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        switch (response.status) {
            case 200:
                {
                    this.fetchMarket();    
                    if (this.state.hasShipID) {
                        console.log("inside fetchbuyship status 200");
                        console.log(this.state.selectedRow);
                        var newCurrency = this.props.playerCurrency - this.state.selectedRow.shipCost;
                        this.setState({ playerCurrency: newCurrency });
                    }
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
        this.setState({ playerCurrency: this.props.playerCurrency });
        this.fetchMarket();
    }

    OnRowSelect(row, isSelect) {
        console.log("On row select inside market");
        console.log(row);
        this.setState({ hasShipID: true, shipID:row.shipID });
    }

    OnBuyShip() {
        if (this.state.hasShipID) {
            this.fetchBuyShip(this.state.shipID);         
        }
    }

    ShipInformation(row, isSelected) {
        this.setState({ selectedRow: row });
    }

    render() {
        return (<div id="marketContainer">
            <div id="marketHeader">
                <h1>Spaceships for Sale</h1>
            </div>
            <div id="shipTable">
                {MyShipsPanel.renderShipTable(this.state.shipData, this.OnRowSelect)}
            </div>
            <div id="shipInformationPanel">
                <ShipInformationPanel hasShipID={this.state.hasShipID} shipID={this.state.shipID} shipInformationCallback={this.ShipInformation}/>
            </div>
            <div className="marketButton">
                <h1> Your money: {this.state.playerCurrency} </h1>
                <Button variant="primary" size="lg" onClick={this.OnBuyShip} disabled={!this.state.hasShipID}>
                    Buy Ship
                </Button>
            </div>
        </div>)
    }

}


