import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Container } from 'react-bootstrap';
import { MissionInformation } from "./MissionInformation"
import './MissionPanel.css';

const status = {
    toMissionStatus: 1,
    alreadyInAMission: 2,
    missionAccepted: 3,
    loading: 4,
    mainPage: 5,
    missionInformation : 6
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
          status: status.mainPage
      };

      this.OnRowSelect = this.OnRowSelect.bind(this);
      this.OnClickInformation = this.OnClickInformation.bind(this);
      this.BackFromMissionInformation = this.BackFromMissionInformation.bind(this);
      this.OnAcceptMission = this.OnAcceptMission.bind(this);
      this.OnClickToMissionStatus = this.OnClickToMissionStatus.bind(this);
  }

    BackFromMissionInformation() {
        this.setState({ status: status.mainPage });
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
        this.setState({ status: status.missionInformation });
    }

    async fetchAcceptMission(missionID) {
        const response = await fetch('Api/AcceptMission/' + missionID + '',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        if (response.status === 200) {
            this.setState({ status: status.missionAccepted })
        }

        if (response.status === 204 || response.status === 422) {
            this.setState({ status: status.alreadyInAMission });
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

        let showPage;

        switch (this.state.status) {
            case status.alreadyInAMission:
                {
                    showPage = (<Container id="alreadInMissionContainer">
                        <div id="alreadyAcceptedTextContainer">
                            <h1> You already have a mission!</h1>
                            <h1>Go to mission status for further information</h1>
                        </div>
                        <div id="alreadyAcceptedButtonContainer" className="d-grid gap-2">
                            <Button variant="primary" size="lg" onClick={e => { this.setState({ status: status.toMissionStatus })}}>
                                Go: Mission Status
                            </Button>
                        </div>
                    </Container>);
                }
                break;
            case status.mainPage:
                {
                    let selectedMission = this.state.isSelected ? <h4>Selected Mission: {this.state.selectedRow.missionTitle}</h4> : <p></p>;
                    let contents = MissionPanel.renderMissionTable(this.state.missions, this.state.columns, this.state.selectRow);
                    showPage = this.renderMissionPanel(contents, selectedMission, this.state.isSelected)
                }
                break;
            case status.missionInformation:
                {
                    showPage = <MissionInformation selectedRow={this.state.selectedRow} AcceptMission={this.OnAcceptMission} BackToMissionPanel={this.BackFromMissionInformation} />;
                }
                break;
            case status.missionAccepted:
                {
                    showPage = (<div id="missionAcceptedContainer">
                        <h1 id="tabelLabel">Mission accepted</h1>
                        <button className="btn btn-secondary btn-lg" size="lg" onClick={this.OnClickToMissionStatus}>Go: Mission Status</button>
                    </div>);
                }
                break;
        }

        return (<div className="missionBackgroundImage"><div className="MissionPanel">{showPage}</div></div>);
  }

  async populateMissionTableData() {
    const response = await fetch('Api/AvailableMissions');
    const data = await response.json();
    this.setState({ missions: data, loading: false });
  }
}
