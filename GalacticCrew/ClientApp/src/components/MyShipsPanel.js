import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Container } from 'react-bootstrap';
import { MissionInformation } from "./MissionInformation"
import './MyShipsPanel.css';

export class MyShipsPanel extends Component {
    static displayName = MyShipsPanel.name;

    constructor(props) {
        super(props);

        this.state = {
            shipData: [],
            isSelected: false,
            selectedRow: {},
            loading: true,
            hasShips: false,
            unexpectedError: false,
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
                    hasShips: true,
                });
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


    render() {  

        let content = this.state.hasShips ? MyShipsPanel.renderShipTable(this.state.shipData, this.state.rowCallback) : (<h1>No Ships!</h1>)

        return content;
    }

}