'use strict';

import React, { Component } from 'react';
import AnimateNumber from 'react-native-countup';
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  LayoutAnimation,
  Animated,
} from 'react-native';
import { FadeInView } from './fade-in-view.component.js';
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
      consumed: 0.9,
      generated: 0.1,
      prevGen: 0,
      prevCons: 0,
      instant: { generation: 0, consumption: 0 },
    };
  }
  componentWillMount() {
    if (!this.state.paused) {
      this.updateInst();
      this.reqTimer = setInterval(() => this.updateInst(), 1000);
    }
  }
  componentDidMount() {}
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
        LayoutAnimation.easeInEaseOut();
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
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const ratioGen =
      (this.state.instant.generation + this.state.instant.consumption) /
      this.state.instant.generation;
    return (
      <View
        style={
          this.state.expanded ? this.styles.expanded : this.styles.contracted
        }
        className="instant-display"
      >
        <TouchableHighlight
          onPress={this.toggleView}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              style={{
                flex: this.state.generated,
                backgroundColor: 'rgba(0,255,0, .7)',
              }}
            >
              <AnimateNumber
                value={this.state.instant.generation}
                numberOfLines={1}
                timing="easeOut"
                style={
                  this.state.expanded
                    ? this.styles.textShow
                    : this.styles.textHide
                }
                formatter={this.formatter}
              />
            </View>
            <View
              className="used"
              style={{
                flex: this.state.consumed,
                backgroundColor: 'rgba(255,69,0,.7)',
              }}
            >
              <AnimateNumber
                value={this.state.instant.consumption}
                timing="easeOut"
                numberOfLines={1}
                style={
                  this.state.expanded
                    ? this.styles.textShowRight
                    : this.styles.textHide
                }
                formatter={this.formatter}
              />
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
  formatter = val => parseFloat(val).toFixed(0);

  fontStyleBase = {
    fontFamily: 'Avenir Next',
    fontSize: 60,
    height: 80,
    fontWeight: '600',
    position: 'absolute',
    width: 200,
    opacity: 1,
  };

  styles = StyleSheet.create({
    contracted: {
      height: 80,
      marginTop: -30,
      flexDirection: 'row',
    },
    expanded: {
      height: 80,
      marginTop: 20,
      flexDirection: 'row',
    },
    textShow: {
      ...this.fontStyleBase,
      color: 'darkgreen',
    },
    textShowRight: {
      ...this.fontStyleBase,
      textAlign: 'right',
      right: 0,
      color: 'maroon',
    },
    textHide: {
      opacity: 0,
    },
  });
}
