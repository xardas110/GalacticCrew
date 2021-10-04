import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export class MissionPanel extends Component {
    static displayName = MissionPanel.name;

  constructor(props) {
    super(props);
    this.state = { forecasts: [], loading: true };
  }

  componentDidMount() {
    this.populateWeatherData();
  }

    static renderForecastsTable(forecasts) {
      return (
          
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Title</th>
            <th>Reward</th>
            <th>Distance</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(mission =>
              <tr key={mission.missionTitle}>
                  <td>{mission.missionTitle}</td>
                  <td>{mission.missionReward}</td>
                  <td>{mission.missionDistance}</td>
                  <td>{mission.missionDesc}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
          : MissionPanel.renderForecastsTable(this.state.forecasts);

    return (
      <div>
        <h1 id="tabelLabel" >Mission Panel</h1>
        <p>This data is sent by the backend via GET request. This data is from mysql missions table</p>
        {contents}
      </div>
    );
  }

  async populateWeatherData() {
    const response = await fetch('Missions/AllMissions');
    const data = await response.json();
    this.setState({ forecasts: data, loading: false });
  }
}
