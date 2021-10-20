import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import { MyShipsPanel } from './MyShipsPanel';
import { ShipInformationPanel } from './ShipInformationPanel';
import './Market.css';

const status = {
    null: 0,
    shipBought: 1,
    shipNotBought: 2,
    market: 3,
    loading: 4
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
            status: status.market
        }
        this.tradeStatusRef = React.createRef();
        this.OnRowSelect = this.OnRowSelect.bind(this);
        this.OnBuyShip = this.OnBuyShip.bind(this);
        this.ShipInformation = this.ShipInformation.bind(this);
    }


    static async FetchPlayerCurrency() {

        const response = await fetch('Api/PlayerCurrency',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            });

        console.log(response.status);

        switch (response.status) {
            case 200:
                {
                    const data = await response.json();
                    return data.currency;
                }
                break;
            default:
                {
                    return -1;
                }
                break;
        }     
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
                    console.log("market response data");
                    console.log(data);
                    this.setState({ shipData: data, marketStatus: status.Market });                 
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
                        var newCurrency = await Market.FetchPlayerCurrency();
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

    async componentDidMount() {
        await this.fetchMarket();
        
        let currency = await Market.FetchPlayerCurrency();
        console.log("outcurrency from componentDidMount");
        console.log(currency);
        if (currency > -1) {
            this.setState({ playerCurrency : currency });
        }
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

    renderMarket() {
        return(<div><div id="marketHeader">
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
                <h1 ref={this.tradeStatusRef}></h1>
                <Button variant="primary" size="lg" onClick={this.OnBuyShip} disabled={!this.state.hasShipID}>
                    Buy Ship
                </Button>
            </div></div>)
    }

    render() {
        let content;

        switch (this.state.status) {
            case status.market:
                {
                    content = this.renderMarket();
                }
                break;
            case status.shipBought:
                {
                    content = this.renderMarket();
                    this.tradeStatusRef.current.innerHTML = "Success Bought ship";
                    setTimeout(e => { this.tradeStatusRef.current.innerHTML = ""}, 2000);
                }
                break;
            case status.shipNotBought:
                {
                    content = this.renderMarket();
                    this.tradeStatusRef.current.innerHTML = "Not enough currency";
                    setTimeout(e => { this.tradeStatusRef.current.innerHTML = "" }, 2000);
                }
                break;
            case status.loading:
                {
                    content = (<h1>Loading...</h1>);
                }
                break;
            default:
                {
                    content = (<h1>Unexpected error</h1>);
                }
        }

        return (<div id="marketContainer">
            {content}
        </div>)
    }

}


