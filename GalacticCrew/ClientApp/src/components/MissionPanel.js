import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Container } from 'react-bootstrap';
import { MissionInformation } from "./MissionInformation"
import './MissionPanel.css';

const status = {
    toMissionStatus: 1
}

export class MissionPanel extends Component {
    static displayName = MissionPanel.name;

  constructor(props) {
      super(props);

     const columns = [{
          dataField: 'missionID',
          text: 'Mission ID',
          sort: true,
          hidden:true
      }, {
          dataField: 'missionTitle',
          text: 'Mission Title',
          sort: true
      }, {
          dataField: 'missionType',
          text: 'Mission Type',
          sort: true
         }, {
             dataField: 'missionReward',
             text: 'Mission Reward',
             sort: true
         }, {
             dataField: 'missionDistance',
             text: 'Mission Distance',
             sort: true
         }];

      const selectRow = {
          mode: 'radio',
          clickToSelect: true,
          onSelect: (row, isSelect, rowIndex, e) => {
              this.OnRowSelect(row, isSelect);
          },
          bgColor: 'rgba(80,18,115,0.5)'
      };

      this.state = {
          missions: [],
          columns: columns,
          selectRow: selectRow,
          isSelected: false,
          selectedRow: {},
          showMissionInformation: false,
          loading: true,
          missionAccepted: false,
          alreadyInAMission: false,
          status:status
      };

      this.OnRowSelect = this.OnRowSelect.bind(this);
      this.OnClickInformation = this.OnClickInformation.bind(this);
      this.BackFromMissionInformation = this.BackFromMissionInformation.bind(this);
      this.OnAcceptMission = this.OnAcceptMission.bind(this);
      this.OnClickToMissionStatus = this.OnClickToMissionStatus.bind(this);
  }

    BackFromMissionInformation() {
        this.setState({ showMissionInformation: false });
    }

  componentDidMount() {
    this.populateMissionTableData();
  }

    OnRowSelect(row, isSelect) {
        console.log(row);
        this.setState({ isSelected: isSelect, selectedRow: row });
    }


    static renderMissionTable(missions, columns, selectRow) {
        console.log(columns);
        return (<BootstrapTable responseive="sm" headerClasses="id-custom-cell" rowClasses="custom-row-class" selectRow={selectRow} keyField="missionID" data={missions} columns={columns} />);
    }

    OnClickInformation(e) {
        console.log("Onclick information pressed");
        this.setState({ showMissionInformation: true });
    }

    async fetchAcceptMission(missionID) {
        const response = await fetch('Api/AcceptMission/' + missionID + '',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        if (response.status === 200) {
            this.setState({ missionAccepted: true })
        }

        if (response.status === 204 || response.status === 422) {
            this.setState({ alreadyInAMission: true });
        }
    }

    OnAcceptMission() {
        this.setState({ showMissionInformation: false });
        console.log(this.state.selectedRow);
        this.fetchAcceptMission(this.state.selectedRow.missionID);
    }

    OnClickToMissionStatus() {
        console.log("Onlick to mission stuats");
        this.setState({ status: status.toMissionStatus });
    }

    renderMissionPanel(contents, selectedMission, isSelected) {
        return (<div>
            <div id="missionHeader"> 
                <h1 id="tabelLabel" >Mission Panel</h1>
            </div>
            <div id="missionTableContainer">
                {contents}
            </div>
            <div id="selectedMissionContainer">
                {selectedMission}
            </div>
            <div className="d-grid gap-2">
                <Button variant="primary" size="lg" disabled={!isSelected} onClick={this.OnAcceptMission}>
                    Accept Mission
                </Button>
                <Button variant="secondary" size="lg" disabled={!isSelected} onClick={ this.OnClickInformation}>
                    More Information
                </Button>
            </div>
        </div>
        );
    }

    render() {

        if (this.state.status == status.toMissionStatus) {
            return (<Redirect to="/MissionStatus" />); 
        }

        if (this.state.alreadyInAMission)
            return (<Container><h1> You already have a mission!</h1>
                <h1>Go to mission status for further information</h1></Container>);

        let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : MissionPanel.renderMissionTable(this.state.missions, this.state.columns, this.state.selectRow);

        let selectedMission = this.state.isSelected ? <h4>Selected Mission: {this.state.selectedRow.missionTitle}</h4>:<p></p>;

        let showPage = this.state.showMissionInformation ?
            <MissionInformation selectedRow={this.state.selectedRow} AcceptMission={this.OnAcceptMission} BackToMissionPanel={this.BackFromMissionInformation} />
            : this.renderMissionPanel(contents, selectedMission, this.state.isSelected);

        if (this.state.missionAccepted)
            showPage = (<div id="missionAcceptedContainer">
                <h1 id="tabelLabel">Mission accepted</h1>
                <button className="btn btn-secondary btn-lg" size="lg" onClick={this.OnClickToMissionStatus}>Go: Mission Status</button>
            </div>);

        return (<div className="missionBackgroundImage"><div className="MissionPanel">{showPage}</div></div>);
  }

  async populateMissionTableData() {
    const response = await fetch('Api/AvailableMissions');
    const data = await response.json();
    this.setState({ missions: data, loading: false });
  }
}
