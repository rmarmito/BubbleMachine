import React, { Component } from 'react';
import {
  ButtonToolbar,
  Container,
  Table,
  ToggleButton,
  ToggleButtonGroup
} from 'react-bootstrap';

import Point from '../components/Point';
import Segment from '../components/Segment';
import WaveformView from '../components/WaveformView';
import '../App.css';

const urls = {
  1: {
    audioUrl: '../assets/RickRoll.mp3',
    audioContentType: 'audio/mpeg',
    waveformDataUrl: '../assets/RickRoll.dat'
  },
};

class App extends Component {
  constructor() {
    super();

    this.state = {
      ...urls[1]
    };
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <h1>
            Waveform Prototype
          </h1>

          <p>
            This is a simple example of how to use <a href="https://github.com/bbc/peaks.js">Peaks.js</a> to create interactive waveforms. This build should only be used for testing as it makes use of code from the <a href = "https://github.com/bbc/peaks.js">Peaks.js React example</a>
          </p>

          <WaveformView
            audioUrl={this.state.audioUrl}
            audioContentType={this.state.audioContentType}
            waveformDataUrl={this.state.waveformDataUrl}
            setSegments={this.setSegments}
            setPoints={this.setPoints}
          />

          {this.renderSegments()}
          {this.renderPoints()}
        </Container>
      </React.Fragment>
    );
  }

  handleSelectedAudioChange = () => {
    this.setState({
      audioUrl: '../assets/RickRoll.mp3',
      audioContentType: 'audio/mpeg',
      waveformDataUrl:'../assets/RickRoll.dat'
    });
  };

  setSegments = (segments) => {
    this.setState({ segments });
  };

  renderSegments() {
    const segments = this.state.segments;

    if (!segments) {
      return null;
    }

    if (segments.length === 0) {
      return null;
    }

    return (
      <React.Fragment>
        <h2>Segments</h2>
        <Table striped bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Start time</th>
              <th>End time</th>
              <th>Label text</th>
            </tr>
          </thead>
          <tbody>
            {this.renderSegmentRows(segments)}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }

  renderSegmentRows(segments) {
    return segments.map((segment) =>
      <Segment
        id={segment.id}
        key={segment.id}
        startTime={segment.startTime}
        endTime={segment.endTime}
        labelText={segment.labelText}
      />
    );
  }

  setPoints = (points) => {
    this.setState({ points });
  };

  renderPoints() {
    const points = this.state.points;

    if (!points) {
      return null;
    }

    if (points.length === 0) {
      return null;
    }

    return (
      <React.Fragment>
        <h2>Points</h2>,
        <Table striped bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Time</th>
              <th>Label text</th>
            </tr>
          </thead>
          <tbody>
            {this.renderPointRows(points)}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }

  renderPointRows(points) {
    return points.map((point) =>
      <Point
        id={point.id}
        key={point.id}
        time={point.time}
        labelText={point.labelText}
      />
    );
  }
}

export default App;