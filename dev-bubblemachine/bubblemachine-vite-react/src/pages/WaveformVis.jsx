// WaveformVisualizer.js
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import Point from "../components/Point";
import Segment from "../components/Segment";
import WaveformView from "../components/WaveformView";
import "../App.css";

const urls = {
  1: {
    audioUrl: "../src/assets/RickRoll.mp3",
    audioContentType: "audio/mpeg",
    waveformDataUrl: "../src/assets/RickRoll.dat",
  },
};

class WaveformVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      ...urls[1],
    };
  }

  handleSelectedAudioChange = () => {
    this.setState({
      audioUrl: "../assets/RickRoll.mp3",
      audioContentType: "audio/mpeg",
      waveformDataUrl: "../assets/RickRoll.dat",
    });
  };

  setSegments = (segments) => {
    this.setState({ segments });
  };

  renderSegments() {
    const segments = this.state.segments;

    if (!segments || segments.length === 0) {
      return null;
    }

    return (
      <>
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
          <tbody>{this.renderSegmentRows(segments)}</tbody>
        </Table>
      </>
    );
  }

  renderSegmentRows(segments) {
    return segments.map((segment) => (
      <Segment
        id={segment.id}
        key={segment.id}
        startTime={segment.startTime}
        endTime={segment.endTime}
        labelText={segment.labelText}
      />
    ));
  }

  setPoints = (points) => {
    this.setState({ points });
  };

  renderPoints() {
    const points = this.state.points;

    if (!points || points.length === 0) {
      return null;
    }

    return (
      <>
        <h2>Points</h2>
        <Table striped bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Time</th>
              <th>Label text</th>
            </tr>
          </thead>
          <tbody>{this.renderPointRows(points)}</tbody>
        </Table>
      </>
    );
  }

  renderPointRows(points) {
    return points.map((point) => (
      <Point
        id={point.id}
        key={point.id}
        time={point.time}
        labelText={point.labelText}
      />
    ));
  }

  render() {
    return (
      <>
        <WaveformView
          audioUrl={this.state.audioUrl}
          audioContentType={this.state.audioContentType}
          waveformDataUrl={this.state.waveformDataUrl}
          setSegments={this.setSegments}
          setPoints={this.setPoints}
        />
        {this.renderSegments()}
        {this.renderPoints()}
      </>
    );
  }
}

export default WaveformVisualizer;
