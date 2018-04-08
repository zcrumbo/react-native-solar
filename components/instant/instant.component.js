'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import { fetchDataInstant } from '../../utils/api.js';

export class InstantDisplay extends Component {
  constructor(props) {
    super(props);
    this.toggleView = this.toggleView.bind(this);
    //this.updateInst = this.updateInst.bind(this);
    this.pauseInst = this.pauseInst.bind(this);
    this.tryNum = 0;
    this.state = {
      expanded: true,
      paused: false,
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
    LayoutAnimation.spring();
    this.setState({
      expanded: !this.state.expanded,
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
              style={{ flex: this.state.generated, backgroundColor: 'lime' }}
            >
              <Text
                style={this.state.expanded ? styles.textShow : styles.textHide}
              >
                {this.state.instant.generation}
              </Text>
            </View>
            <View
              className="used"
              style={{
                flex: this.state.consumed,
                backgroundColor: 'orangered',
              }}
            >
              <Text
                numberOfLines={1}
                style={
                  this.state.expanded ? styles.textShowRight : styles.textHide
                }
              >
                {this.state.instant.consumption}
              </Text>
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

const fontStyleBase = {
  opacity: 0.8,
  fontFamily: 'Avenir Next',
  fontSize: 60,
  fontWeight: '600',
  position: 'absolute',
  width: 200
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  contracted: {
    height: 30,
    flexDirection: 'row',
  },
  expanded: {
    height: 80,
    flexDirection: 'row',
  },
  textShow: {
    ...fontStyleBase,
    color: 'darkgreen',
  },
  textShowRight: {
    ...fontStyleBase,
    textAlign: 'right',
    right: 0,
    color: 'maroon'
  },
  textHide: {
    opacity: 0,
  },
});
