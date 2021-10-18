import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import { MissionProbability } from './MissionProbability';
import { MyShipsPanel } from './MyShipsPanel';
import { ShipInformationPanel } from './ShipInformationPanel';
import './MissionStatus.css';
import { MissionProgress } from './MissionProgress';

const status = {
    Null: "Null",
    InProgress: "InProgress",
    NoMission: "NoMission",
    NotStarted: "NotStarted",
}

export class MissionStatus extends Component {
    static displayName = MissionStatus.name;

    constructor(props) {
        super(props)      

        this.state = {
            missionInformation: {},
            missionStatus: status.Null,
            unexpectedError: false,
            redirectBackToMissionPanel: false,
            hasShipID: false,
            shipID:-1
        }
        this.fetchOngoingMission = this.fetchOngoingMission.bind(this);
        this.RedirectBackToMissionPanel = this.RedirectBackToMissionPanel.bind(this);
        this.OnShipRowSelected = this.OnShipRowSelected.bind(this);
        this.OnStartMission = this.OnStartMission.bind(this);
        this.OnCancelMission = this.OnCancelMission.bind(this);     
    }

    async fetchOngoingMission() {
        const response = await fetch('Api/MissionOngoing/',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);
        
        switch (response.status) {
            case 200:
            {
                const data = await response.json();
                if (data.bMissionStarted) {
                    this.setState({
                        missionInformation: data,
                        missionStatus: status.InProgress
                    })
                } else {
                    this.setState({
                        missionInformation: data,
                        missionStatus: status.NotStarted
                    })
                }            
            }
            break;
            case 204:
            {
                this.setState({ missionStatus: status.NoMission })
            }
            break;
            default:
            {
                this.setState({ unexpectedError: true });
            }
            break;
        }
        
    }

    async fetchCancelMission() {
        const response = await fetch('Api/CancelMission',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        switch (response.status) {
            case 200:
            {
                this.setState({ missionInformation: {}, missionStatus: status.NoMission })
            }
            break;
            case 204:
            {
                this.setState({ missionInformation: {} })
                this.setState({ noMission: true })
            }
            break;
            default:
            {
                this.setState({ unexpectedError: true });
            }
            break;
        }
    }

    async fetchStartMission(shipID) {
        const response = await fetch('Api/StartAcceptedMission/'+shipID+'',
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

        console.log(response.status);

        switch (response.status) {
            case 200:
                {
                    this.fetchOngoingMission();
                }
                break;
            default:
                {
                    this.setState({ unexpectedError: true });
                }
                break;
        }
    }

    componentDidMount(props) {
        this.fetchOngoingMission();
    }

    RedirectBackToMissionPanel(e) {
        this.setState({ redirectBackToMissionPanel: true });
    }

    renderNoMission() {
        return (<div id="noMissionContainer"><h1 id="noMissionInProgressText">No Mission in progress!</h1>
            <div className="d-grid gap-2">
                </div>
                <Button variant="secondary" size="lg" onClick={this.RedirectBackToMissionPanel}>
                    Back to mission panel
                </Button>
        </div>)           
    }

    OnShipRowSelected(row, isSelected) {
        console.log("Row callback function running");
        console.log(row);
        if (row.shipID) {
            this.setState({
                hasShipID: true,
                shipID: row.shipID
            })
        }
    }

    OnStartMission(e) {
        this.fetchStartMission(this.state.shipID)
    }

    OnCancelMission(e) {
        this.fetchCancelMission();
    }

    renderWithMission(missionInformation, rowCallBackFunc) {
        return (<div id="renderWithMissionContainer">
            <div className="missionStatusHeader">
                <h1>You have accepted a mission!</h1>
                <table className="missionStatusTable">
                    <tr>
                        <th>Title</th>
                        <th>Mission Rank</th>
                        <th>Mission Type</th>
                        <th>Distance</th>
                    </tr>
                    <tr>
                        <td>{missionInformation.missionTitle} </td>
                        <td>{missionInformation.missionRank}</td>
                        <td>{missionInformation.missionType}</td>
                        <td>{missionInformation.missionDistance}</td>
                    </tr>
                </table>
            </div>
            <div className="shipsPanel">
                <MyShipsPanel hasRowCallback={true} rowCallback={rowCallBackFunc} />
            </div>
            <div className="shipInformationPanel">
                <ShipInformationPanel hasShipID={this.state.hasShipID} shipID={this.state.shipID} />
            </div>
                <div className="missionProbability">
                    <MissionProbability shipID={this.state.shipID} missionID={missionInformation.missionID}/>
                </div>
                <div className="missionButtons">
                    <Button variant="primary" size="lg" onClick={this.OnStartMission}>
                        Start Mission
                    </Button>
                    <Button variant="secondary" size="lg" onClick={this.OnCancelMission}>
                        Cancel Mission
                    </Button>
                </div>
        </div>)
    }

    renderMissionInProgress(startDate, duration, title) {
        return (<MissionProgress missionStartDate={startDate} cancelMissionCallback={this.OnCancelMission} missionDuration={duration} missionTitle={title} />);
    }

    render() {

        if (this.state.redirectBackToMissionPanel) {
            return (<Redirect to="/MissionPanel" />)
        }

        let content;

        switch (this.state.missionStatus) {
            case status.NoMission:
                {
                    content = this.renderNoMission();
                }
                break;
            case status.InProgress:
                {
                    content = this.renderMissionInProgress(this.state.missionInformation.missionStartedDate, this.state.missionInformation.missionDuration, this.state.missionInformation.missionTitle)
                }
                break;
            case status.NotStarted:
                {
                    content = this.renderWithMission(this.state.missionInformation, this.OnShipRowSelected);
                }
                break;
            default:
                {
                    
                }
                break;
        }

        return (<div className="tableBackgroundImg"><div className="missionStatusContent">{content}</div></div>);
    }

}


