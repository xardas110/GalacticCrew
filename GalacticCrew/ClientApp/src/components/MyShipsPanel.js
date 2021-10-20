import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Container } from 'react-bootstrap';
import { MissionInformation } from "./MissionInformation"
import './MyShipsPanel.css';


const status =
{
    noShips:0,
    hasShips: 1,
    unexpectedError: 2,
    loading: 3,
    redirectMarket: 4
}

export class MyShipsPanel extends Component {
    static displayName = MyShipsPanel.name;

    constructor(props) {
        super(props);

        this.state = {
            shipData: [],
            isSelected: false,
            selectedRow: {},
            status: status.loading,
            rowCallback: this.OnRowSelect
        };

        this.OnRowSelect = this.OnRowSelect.bind(this);
    }

    OnRowSelect(row, isSelect) {
        console.log(row);
        this.setState({ isSelected: isSelect, selectedRow: row });
    }

    componentDidMount() {
        this.fetchMyShips();
        console.log("componentDidMount myships panel")
        console.log(this.props);
        if (this.props.hasRowCallback && this.props.rowCallback != this.state.rowCallback) {
            this.setState({ rowCallback:this.props.rowCallback })
        }

    }

    async fetchMyShips() {
        const response = await fetch('Api/MyShips',
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
                    status: status.hasShips
                });
            }
            break;
            case 204:
            {
                    this.setState({ status: status.noShips });
            }
            break;
            default:
            {
                    this.setState({ status: status.unexpectedError });
            }
            break;
        }
    }

    static renderShipTable(shipData, callbackFunc) {

        const columns = [{
            dataField: 'shipID',
            text: 'ship ID',
            sort: true,
            hidden:true
        }, {
            dataField: 'shipTitle',
            text: 'Ship Name',
            sort: true
            }];

        const selectRow = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: (row, isSelect, rowIndex, e) => {
                callbackFunc(row, isSelect);
            },
            bgColor: 'rgba(80,18,115,0.96)'
        };

        return (<BootstrapTable headerClasses="headerTable" rowClasses="rowTable" selectRow={selectRow} keyField="shipID" data={shipData} columns={columns} />)
    }


    static renderShipTableCustomColumn(shipData, callbackFunc, customColumns) {
        const selectRow = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: (row, isSelect, rowIndex, e) => {
                callbackFunc(row, isSelect);
            },
            bgColor: 'rgba(80,18,115,0.96)'
        };

        return (<BootstrapTable headerClasses="headerTable" rowClasses="rowTable" selectRow={selectRow} keyField="shipID" data={shipData} columns={customColumns} />)
    }

    render() {  

        let content;

        switch (this.state.status) {
            case status.hasShips:
                {
                    content = MyShipsPanel.renderShipTable(this.state.shipData, this.state.rowCallback);
                }
                break;
            case status.noShips:
                {
                    content = (<div id="noShipsContainer">
                        <h3>No ships! Go to market to buy a ship</h3>
                        <div className="noShipsButton">
                            <Button variant="primary" size="lg" onClick={e => { this.setState({ status: status.redirectMarket }) }}>
                                Go: Market
                            </Button>
                        </div>
                    </div>);
                }
                break;
            case status.loading:
                {
                    content = (<h1>loading...</h1>);
                }
                break;
            case status.redirectMarket:
                {
                    return <Redirect to="/market"/>
                }
                break;
            default:
                {
                    content = (<h1>Unexpected error</h1>);
                }
                break;
        }

        return content;
    }

}