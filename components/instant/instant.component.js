'use strict';

import React, { Component } from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';
import { fetchDataInstant } from '../../utils/api.js';

export class InstantDisplay extends Component {
  constructor(props) {
    super(props);
    this.toggleView = this.toggleView.bind(this);
    //this.updateInst = this.updateInst.bind(this);
    this.pauseInst = this.pauseInst.bind(this);
    this.tryNum = 0;
    this.state = {
      expanded: false,
      paused: false,
      classes: 'dataVis',
      consumed: 0.5,
      generated: 0.5,
      prevGen: 0,
      prevCons: 0,
      instant: {
        generation: 0,
        consumption: 0,
      },
    };
  }
  componentWillMount() {
    if (!this.state.paused) {
      this.updateInst();
      this.reqTimer = setInterval(() => this.updateInst(), 1000);
    }
  }
  componentWillUnmount() {
    clearInterval(this.reqTimer);
  }

  updateInst() {
    if (!this.tryNum) this.tryNum = 1;
    fetchDataInstant()
      .then(res => {
        this.tryNum = 1;
        let total = res.instant.consumption + res.instant.generation;
        let percentMade = res.instant.generation / total;
        let percentUsed = res.instant.consumption / total;
        this.setState(prevState => ({
          generated: percentMade,
          consumed: percentUsed,
          prevGen: prevState.instant.generation,
          prevCons: prevState.instant.consumption,
        }));
        this.setState(res);
      })
      .catch(err => {
        this.tryNum++;
        if (this.tryNum === 4) {
          clearInterval(this.reqTimer);
        }
      });
  }
  pauseInst() {
    !this.state.paused
      ? clearInterval(this.reqTimer)
      : (this.reqTimer = setInterval(() => this.updateInst(), 1000));
    this.setState({ paused: !this.state.paused });
  }

  toggleView() {
    let newclass;
    this.state.expanded ? (newclass = 'contracted') : (newclass = 'expanded');
    this.setState({
      expanded: !this.state.expanded,
      classes: newclass,
    });
  }

  render() {
    const ratioGen =
      (this.state.instant.generation + this.state.instant.consumption) /
      this.state.instant.generation;
    return (
      <View
        style={this.state.expanded ? styles.expanded : styles.contracted}
        className="instant-display"
      >
        <TouchableHighlight onPress={this.toggleView} style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              className="made"
              style={{ flex: this.state.generated, backgroundColor: 'green' }}
            >
              <Text style={this.state.expanded ? styles.textShow : styles.textHide}>{this.state.instant.generation} Watts</Text>
            </View>
            <View
              className="used"
              style={{ flex: this.state.consumed, backgroundColor: 'red' }}
            >
              <Text style={this.state.expanded ? styles.textShow : styles.textHide}>{this.state.instant.consumption} Watts</Text>
            </View>
          </View>
        </TouchableHighlight>
        {/* (<Text>Instant</Text>
        <Text className="btn-classic" onClick={this.pauseInst}>
        &#9616;&#9616;
      </Text>) */}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  contracted: {
    height: 40,
    flexDirection: 'row',
  },
  expanded: {
    height: 80,
    flexDirection: 'row',
  },
  textShow: {
    opacity: .5,
  },
  textHide: {
    opacity: 0,
  }
  
});
